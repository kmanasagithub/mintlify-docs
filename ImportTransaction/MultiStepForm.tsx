import React, { useState, useRef, useEffect } from 'react';

import Progress from './Progress';
import { MultiStepFormRenderer } from './Screens/Util';
import { Step, FormData } from './types';
import './MultiStepForm.css';
import { Link } from 'react-router-dom';

// Define the structure of the form ref
interface FormRefs {
  submit: () => Promise<any>; // The submit function must return a Promise
}

function Multi() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({});
  const [initialValues, setInitialValues] = useState<FormData>({});
  const [file, setFile] = useState<string | null>(null);
  // Initialize formRef with a default submit function
  const formRef = useRef<FormRefs>({
    submit: async () => true,
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const updateInitialValues = (values: Partial<FormData>) => {
    setInitialValues((prevValues) => ({ ...prevValues, ...values }));
  };

  const totalSteps = 6;

  const handleNext = async () => {
    if (formRef.current.submit) {
      try {
        const isValid = await formRef.current.submit();
        if (isValid) {
          // Check if the file is "savedTemplate" to jump directly to step 6
          if (file === 'savedTemplate') {
            setStep(6);
          } else {
            setStep((prev) =>
              prev < totalSteps ? ((prev + 1) as Step) : prev
            );
          }
        }
      } catch (error) {
        // Handle error if needed
      }
    } else {
      setStep((prev) => (prev < totalSteps ? ((prev + 1) as Step) : prev));
    }
  };

  useEffect(() => {
    // Trigger the form submission only when `step` changes to 2
    if (formRef.current && step === 2) {
      formRef.current.submit().then((result) => {
        setFile(result); // Set the state with the resolved value
        // Check if the file is "savedTemplate" to jump directly to step 6
        if (result === 'savedTemplate') {
          setStep(6);
        }
      });
    }
  }, [step]); // Runs only when `step` changes
  const previousStep = () =>
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  const handleSubmit = async () => {
    if (formRef.current.submit) {
      try {
        const isFinalValid = await formRef.current.submit();
        if (isFinalValid) {
          // Handle final submission here
        }
      } catch (error) {
        // Handle error if needed
      }
    }
  };

  return (
    <div className="container">
      <div className="progress_container">
        <Progress step={step} totalSteps={totalSteps} />
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`${step >= i + 1 ? 'circle active' : 'circle'}`}
          >
            {i + 1}
            <span>
              {
                [
                  'Upload',
                  'Import settings',
                  'Required columns',
                  'Attributes',
                  'Optional columns',
                  'Review & save',
                ][i]
              }
            </span>
          </div>
        ))}
      </div>
      <div className="content">
        <hr />
        <MultiStepFormRenderer
          step={step}
          formData={formData}
          initialValues={initialValues}
          updateFormData={updateFormData}
          updateInitialValues={updateInitialValues}
          formRef={formRef}
        />
      </div>
      <div className="btns">
        <div>
          <Link to="/transaction-list">
            <button className="border small-round btn" onClick={handleSubmit}>
              <span>Cancel</span>
            </button>
          </Link>
        </div>
        <div>
          {file !== 'savedTemplate' && step !== 1 && (
            <button className="border small-round btn" onClick={previousStep}>
              <span>Prev</span>
            </button>
          )}

          {step < totalSteps ? (
            <button
              className="border small-round btn ms-4"
              onClick={handleNext}
            >
              <span>Next</span>
            </button>
          ) : (
            <button
              className="border small-round btn ms-4"
              onClick={handleSubmit}
            >
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MultiStepForm() {
  return <Multi />;
}
