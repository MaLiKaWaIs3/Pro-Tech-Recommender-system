import React, { useState } from 'react';
import styles from './Login.module.css';
import styling from '../SignUp/SignUp.module.css';

import OTPForm from './Otpform';

const ForgotPasswordAndOTP = () => {
  const [email, setEmail] = useState('');
  const [otpInputs, setOTPInputs] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);

  const buttonRef = React.createRef();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Send a POST request to your backend to send the OTP
    try {
      const response = await fetch('http://localhost:3001/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('OTP sent successfully.');
        setShowOTPForm(true);
      } else {
        setMessage(`Failed to send OTP \n Enter Correct Email.`);
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };


  return (
    <div className="forgetpassword" id={styling.signUpBody}>
      <div className={styles.greenLayer1}>

        <div className="forgot-password-container">
          {showOTPForm ? (<OTPForm email={email} />)
            :
            (
              <>
                <h2 className='text-white'>Forgot Password</h2>
                <form onSubmit={handleEmailSubmit} className="forgot-password-form">
                      <div className='form-floating col-12 mx-2'>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                className="form-control"
                            />
                            <label htmlFor="email" >Email</label>
                        </div>
                  <button id={styles.loginBtn} className='d-block m-auto mt-4 px-4' > Get OTP  </button>
                </form>
                <p>{message}</p>
              </>
            )}
        </div>
      </div>
    </div>

  );
};

export default ForgotPasswordAndOTP;
