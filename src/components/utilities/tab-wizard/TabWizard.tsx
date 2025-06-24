// src/components/tab-wizard/TabWizard.tsx
'use client'

import Stepper from "./Stepper";
import ProgressBar from "./ProgressBar";

interface Step {
  id: number;
  label: string;
}

export default function TabWizard({steps, currentStep}: {steps: Step[], currentStep: number}) {
    return (
        <div style={styles.tabWizard}>
            <Stepper currentStep={currentStep} steps={steps} />
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    tabWizard: {
        position: 'relative',
        height: '100%',
    }
}