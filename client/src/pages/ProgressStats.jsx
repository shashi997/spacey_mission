    import React, { useEffect, useMemo, useState } from "react";
    import { Link } from "react-router-dom";
    import { BarChart3, Rocket, Trophy, RefreshCcw } from "lucide-react";
    import { useAuth } from "../features/authentication";
    import { getUserTraits, getMissionHistory } from "../features/lesson-player/services/progressApi";

    /**
     * A sleek, self-contained dashboard for /dashboard/progress.
     * Data source: Firestore-only via progressApi.js
     */
    export default function ProgressStats() {
    const { user } = useAuth();
    const [traits, setTraits] = useState({});
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [showSample, setShowSample] = useState(false);

    // Used when the user has no progress yet
    const sampleTraits = {
        Curiosity: 7,
        "Problem Solving": 6,
        "Attention to Detail": 5,
        Creativity: 4,
        Persistence: 3,
        "Team Spirit": 2,
    };

    useEffect(() => {
        let isMounted = true;
        async function load() {
        if (!user?.uid) return;
        setLoading(true);
        setErr(null);
        try {
            const t = await getUserTraits(user.uid);
            const m = await getMissionHistory(user.uid);
            if (!isMounted) return;
            setTraits(t?.traits || {});
            setMissions(m?.missions_completed || []);
        } catch (e) {
            console.error("Progress load failed:", e);
            if (isMounted) setErr(e?.message || "Failed to load progress");
        } finally {
            if (isMounted) setLoading(false);
        }
        }
        load();
        return () => { isMounted = false; };
    }, [user?.uid]);

    const effectiveTraits = showSample ? sampleTraits : traits;

    const computed = useMemo(() => {
        const entries = Object.entries(effectiveTraits || {});
        if (entries.length === 0) return { top: [], avg: 0, max: 0, totalSignals: 0 };

        const max = Math.max(...entries.map(([, v]) => v));
        const totalSignals = entries.reduce((acc, [, v]) => acc + (typeof v === "number" ? v : 0), 0);
        // Relative 1–5 score normalized to the strongest trait
        const scores = entries.map(([k, v]) => {
        const rel = max > 0 ? v / max : 0;
        const score5 = Math.max(1, Math.round(rel * 5)); // 1–5
        const pct = Math.round(rel * 100);
        return { name: k, value: v, score5, pct };
        });
        scores.sort((a, b) => b.value - a.value);

        const avg = scores.reduce((acc, s) => acc + s.score5, 0) / scores.length;
        return {
        top: scores.slice(0, 6),
        avg: Math.round(avg * 10) / 10,
        max,
        totalSignals,
        };
    }, [effectiveTraits]);

    if (!user) {
        return (
        <div className="max-w-screen-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-2">Progress &amp; Stats</h2>
            <p className="opacity-80">Please <Link to="/login" className="underline">log in</Link> to view your progress.</p>
        </div>
        );
    }

    return (
        <div className="max-w-screen-xl mx-auto p-6">
        <header className="flex items-center gap-3 mb-6">
            <BarChart3 />
            <h2 className="text-2xl font-bold">Smart Profile Dashboard</h2>
            <span className="ml-auto text-sm opacity-70">
            {missions?.length || 0} mission{(missions?.length || 0) === 1 ? "" : "s"} completed
            </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Summary card */}
            <section className="col-span-1 bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            {loading ? (
                <p className="opacity-70">Loading…</p>
            ) : err ? (
                <p className="text-red-400">Error: {String(err)}</p>
            ) : (
                <>
                {Object.keys(traits).length === 0 && !showSample ? (
                    <EmptyState onUseSample={() => setShowSample(true)} />
                ) : (
                    <>
                    <p className="opacity-90">
                        Your top strengths are{" "}
                        <strong>{computed.top.slice(0,3).map(t => t.name).join(", ")}</strong>. Keep completing missions to
                        strengthen these traits and unlock new ones.
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        <KPI label="Avg. Trait Score" value={computed.avg} />
                        <KPI label="Signals Tracked" value={computed.totalSignals} />
                        <KPI label="Completed" value={missions?.length || 0} />
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-sm opacity-80">
                        <Rocket size={16} />
                        <span>Traits update as you make choices in lessons — they’re dynamic, not fixed.</span>
                    </div>
                    </>
                )}
                </>
            )}

            <div className="mt-6 flex items-center gap-3 text-sm">
                <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 transition"
                onClick={() => {
                    setShowSample(false);
                    setTraits({ ...traits }); // trigger recompute
                }}
                title="Refresh from Firestore"
                >
                <RefreshCcw size={16} /> Refresh
                </button>
                <button
                className="ml-auto underline opacity-80 hover:opacity-100 transition text-sm"
                onClick={() => setShowSample(s => !s)}
                >
                {showSample ? "Hide sample data" : "Use sample data"}
                </button>
            </div>
            </section>

            {/* Right: Traits list */}
            <section className="col-span-1 lg:col-span-2 bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Evolving Traits</h3>
                <div className="text-sm opacity-70">Scores are relative to your strongest trait</div>
            </div>

            {loading ? (
                <div className="opacity-70">Loading…</div>
            ) : err ? (
                <div className="text-red-400">Error: {String(err)}</div>
            ) : (Object.keys(effectiveTraits).length === 0 ? (
                <div className="opacity-70">No traits yet. Start a mission and make choices to see this grow!</div>
            ) : (
                <ul className="space-y-4">
                {computed.top.map((t) => (
                    <li key={t.name} className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm opacity-80">Score: {t.score5}/5</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                        className="h-2 rounded-full"
                        style={{ width: `${t.pct}%`, background: "linear-gradient(90deg, rgba(56,189,248,0.9), rgba(168,85,247,0.9))" }}
                        />
                    </div>
                    </li>
                ))}
                </ul>
            ))}
            </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center opacity-90">
            <Trophy className="inline-block mb-2" />
            <p>
            Finish more missions to unlock badges and refine your profile.
            <br />
            <Link to="/dashboard/my-lessons" className="underline">Continue learning →</Link>
            </p>
        </div>
        </div>
    );
    }

    function KPI({ label, value }) {
    return (
        <div className="rounded-xl p-4 border border-white/10 bg-white/5 text-center">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs opacity-70">{label}</div>
        </div>
    );
    }

    function EmptyState({ onUseSample }) {
    return (
        <div className="p-4 rounded-lg border border-dashed border-white/15">
        <p className="opacity-80">
            We haven’t detected any traits yet. Start a mission or use sample data to preview the dashboard.
        </p>
        <div className="mt-3 flex items-center gap-3">
            <Link to="/dashboard/my-lessons" className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 hover:bg-white/20 transition">
            Explore missions
            </Link>
            <button onClick={onUseSample} className="underline text-sm opacity-80 hover:opacity-100 transition">
            Use sample data
            </button>
        </div>
        </div>
    );
    }
