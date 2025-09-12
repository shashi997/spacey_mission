    // client/src/features/lesson-player/components/DebriefBlock.jsx
    import React, { useEffect } from "react";
    import { useParams } from "react-router-dom";
    import { useLessonStore } from "../hooks/useLessonStore";
    import { saveFinalSummary } from "../services/progressApi";
    import { auth } from "../../../lib/firebase";

    const DebriefBlock = ({ node }) => {
    const lesson = useLessonStore((s) => s.lesson);
    // Fallbacks: route param (common), then any alt keys you might use
    const { lessonId: lessonIdFromRoute, id: idFromRoute } = useParams();
    const missionId =
        lesson?.id ||
        lesson?.lessonId ||
        lessonIdFromRoute ||
        idFromRoute ||
        null;

    useEffect(() => {
        const sendSummary = async () => {
        const userId = auth.currentUser?.uid;

        // Build summary + traits safely
        const summaryText =
            node?.data?.summary ||
            node?.data?.outcome ||
            "Mission complete.";
        const rawTraits = node?.data?.traits;
        const traits = Array.isArray(rawTraits)
            ? rawTraits
            : String(rawTraits || "")
                .split(/[|,]/)
                .map((t) => t.trim())
                .filter(Boolean);

        console.log("[Debrief] mount", { userId, missionId, summaryText, traits });

        if (!userId) {
            console.warn("[Debrief] No auth.currentUser; not saving.");
            return;
        }
        if (!missionId) {
            console.warn("[Debrief] No missionId (lesson?.id and route param empty); not saving.");
            return;
        }

        try {
            await saveFinalSummary(userId, missionId, { outcome: summaryText, traits });
            console.log("✅ [Debrief] saveFinalSummary OK");
        } catch (e) {
            console.warn("❌ [Debrief] saveFinalSummary failed:", e);
        }
        };
        sendSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [missionId, node?.data]);

    return (
        <div className="p-4 rounded-lg bg-gray-900/40 border border-white/10 text-white">
        <h3 className="text-lg font-semibold mb-2">Mission Complete</h3>
        <p className="opacity-80">
            {node?.data?.summary || "Great work! Your progress has been saved."}
        </p>
        </div>
    );
    };

    export default DebriefBlock;
