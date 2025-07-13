// src/components/tab-wizard/Stepper.tsx
'use client'

import {
  StepperContainerStyled,
  StepLabelStyled
} from "@/components/styled-components/stepper.styles";

interface Step {
  id: number;
  label: string;
}

export default function Stepper({currentStep, steps}: {currentStep: number, steps: Step[]}) {
  return (
    <StepperContainerStyled>
      {steps.map((step) => {
        const isDone = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} style={styles.stepItem}>
            <div style={{
              ...styles.stepId,
              borderRadius: isCurrent ? '40%' : '50%',
              backgroundColor: isCurrent ? '#1f282f' : '#cacaca',
            }}>
              {step.id}
            </div>
            <div style={{
              ...styles.stepId,
              position: 'absolute',
              backgroundColor:'#4CAF50',
              opacity: isDone ? 1 : 0,
              zIndex: 4,
            }}>
              ✔
            </div>
            <StepLabelStyled $iscurrent={isCurrent}>
              {step.label}
            </StepLabelStyled>
          </div>
        );
      })}
    </StepperContainerStyled>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  stepItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: '0',
  },
  stepId: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '7px solid #F0F0F0',
    transition: 'opacity 0.6s ease-in-out, border-radius 0.6s ease-in-out, background-color 0.6s ease-in-out',
    backgroundColor: "#cacaca",
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    userSelect: 'none',
    zIndex: 3,
  },
}