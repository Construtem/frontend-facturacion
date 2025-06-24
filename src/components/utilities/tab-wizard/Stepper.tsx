// src/components/tab-wizard/Stepper.tsx
'use client'

interface Step {
  id: number;
  label: string;
}

export default function Stepper({currentStep, steps}: {currentStep: number, steps: Step[]}) {
  return (
    <div style={styles.stepper}>
      {steps.map((step) => {
        const isDone = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} style={styles.step}>
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
            <span style={{
              ...styles.stepLabel,
              color: isCurrent ? "#222222" : "#cacaca",
            }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  stepper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px',
    zIndex: 2,
  },
  step: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
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
  stepLabel: {
    alignContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'color 0.6s ease-in-out',
  },
}