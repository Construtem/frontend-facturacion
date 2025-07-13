// src/components/tab-wizard/ProgressBar.tsx
'use client';

import { useEffect, useState } from 'react';
import {
    ProgressBarContainerStyled,
    ProgressFillStyled
} from '@/components/styled-components/progressBar.styles';

export default function ProgressBar({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
    // Porcentaje de progreso
    const [currentProgress, setCurrentProgress] = useState<number>(0);

    useEffect(() => {
        const newCurrentProgress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        setCurrentProgress(newCurrentProgress);
    }, [currentStep, totalSteps]);

    return (
        <ProgressBarContainerStyled>
            <ProgressFillStyled percentage={currentProgress} />
        </ProgressBarContainerStyled>
    );
}