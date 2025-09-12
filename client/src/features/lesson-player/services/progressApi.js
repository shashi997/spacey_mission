    // client/src/features/lesson-player/services/progressApi.js
    // Firestore v9 (modular) API

    import {
    collection,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
    increment,
    writeBatch,
    } from "firebase/firestore";
    import { db } from "../../../lib/firebase"; // adjust path only if your tree differs

    // Normalize trait ids ("Science Minded" -> "science_minded")
    const toId = (name) => String(name || "").trim().toLowerCase().replace(/\s+/g, "_");

    /**
     * Save a learner's choice and (optionally) bump a trait.
     * Structure:
     * users/{uid}/missions/{missionId}/choices/{blockId}
     * users/{uid}/traits/{traitId} => { name, value }
     */
    export async function saveChoice(uid, missionId, blockId, payload = {}) {
    if (!uid || !missionId || !blockId) return;

    const { optionId = null, text = null, tag = null } = payload;

    // 1) Persist the choice
    const choiceRef = doc(db, "users", uid, "missions", missionId, "choices", blockId);
    await setDoc(
        choiceRef,
        { optionId, text, tag, updatedAt: serverTimestamp() },
        { merge: true }
    );

    // 2) If this choice maps to a trait, increment it
    if (tag) {
        const tRef = doc(db, "users", uid, "traits", toId(tag));
        await setDoc(
        tRef,
        { name: tag, value: increment(1), updatedAt: serverTimestamp() },
        { merge: true }
        );
    }
    }

    /**
     * Bump multiple traits at once (used on mission completion).
     */
    export async function awardTraits(uid, traitNames = [], amount = 1) {
    if (!uid || !traitNames?.length) return;

    const batch = writeBatch(db);
    for (const name of traitNames.filter(Boolean)) {
        const ref = doc(db, "users", uid, "traits", toId(name));
        batch.set(
        ref,
        { name, value: increment(amount), updatedAt: serverTimestamp() },
        { merge: true }
        );
    }
    await batch.commit();
    }

    /**
     * Mark a mission as completed and (optionally) award traits.
     * Pass summary like: { outcome: "Solar System Tour Complete.", traits: ["Curious","Analytical"] }
     */
    export async function saveFinalSummary(uid, missionId, summary = {}) {
    if (!uid || !missionId) return;

    const missionRef = doc(db, "users", uid, "missions", missionId);
    await setDoc(
        missionRef,
        {
        completed: true,
        finalSummary: {
            outcome: summary.outcome ?? summary.summaryText ?? summary.outcomeText ?? null,
            traits: Array.isArray(summary.traits) ? summary.traits : [],
        },
        traitsAwarded: Array.isArray(summary.traits) ? summary.traits : [],
        completedAt: serverTimestamp(),
        },
        { merge: true }
    );

    if (summary?.traits?.length) {
        await awardTraits(uid, summary.traits);
    }
    }

    /**
     * Read all traits for the user.
     * Returns: { traits: { [displayName]: number } }
     */
    export async function getUserTraits(uid) {
    if (!uid) return { traits: {} };
    const snap = await getDocs(collection(db, "users", uid, "traits"));
    const traits = {};
    snap.forEach((d) => {
        const data = d.data() || {};
        const name = data.name || d.id;
        const value = typeof data.value === "number" ? data.value : 0;
        traits[name] = value;
    });
    return { traits };
    }

    /**
     * Read missions; ProgressStats.jsx only needs a count/list of completed.
     * Returns: { missions_completed: Array<string> }
     */
    export async function getMissionHistory(uid) {
    if (!uid) return { missions_completed: [] };
    const snap = await getDocs(collection(db, "users", uid, "missions"));
    const completedIds = [];
    snap.forEach((d) => {
        const m = d.data() || {};
        if (m.completed || m.finalSummary) completedIds.push(d.id);
    });
    return { missions_completed: completedIds };
    }
