// src/components/tab-wizard/ProgressBar.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ProgressBar({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
    // Porcentaje de progreso
    const [currentProgress, setCurrentProgress] = useState<number>(0);

    useEffect(() => {
        const newCurrentProgress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        setCurrentProgress(newCurrentProgress);
    }, [currentStep, totalSteps]);

    return (
        <div style={styles.progressBar}>
            <div
                style={{
                    ...styles.progressFill,
                    height: `${currentProgress}%`,
                }}
            />
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    progressBar: {
        marginLeft: '24px',
        width: '6px',
        height: '100%',
        backgroundColor: '#cacaca',
        borderRadius: '3px',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0,
    },
    progressFill: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#4CAF50',
        transition: 'height 0.6s ease-in-out',
        zIndex: 1,
    },
};