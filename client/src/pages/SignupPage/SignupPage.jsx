import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { MdEmail } from "react-icons/md"
import { FaLock } from "react-icons/fa6"
import { FaCircleUser } from "react-icons/fa6"
import { FaRegCircleUser } from "react-icons/fa6"
import { FaLocationDot } from "react-icons/fa6"
import { FaPhoneFlip } from "react-icons/fa6"

function SignupPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleSurname = (e) => setSurname(e.target.value);
  const handleAddress = (e) => setAddress(e.target.value);
  const handlephoneNumber = (e) => setphoneNumber(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    if (name === '' || surname === '' || email === '' || password === '' || address === '' || phoneNumber === '') {
      setErrorMessage('All fields are required');
      return;
    } else {
      const requestBody = { name, surname, email, password, address, phoneNumber };
      authService
        .signup(requestBody)
        .then((response) => {
          // If the POST request is successful redirect to the login page
          navigate("/login");
        })
        .catch((error) => {
          // If the request resolves with an error, set the error message in the state
          console.log(error)
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        });
    }
  };

  return (
    <div className="MainSignup">
      <div className="SignupPage">
        <h1>Sign Up</h1>

        <form onSubmit={handleSignupSubmit}>
          <div className="inputwrap">
            <div className="relative mt-6 mb-6">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCircleUser class="w-[1.15rem] h-[1.15rem] text-gray-400" />
              </div>
              <input className="input-forms" type="text" name="name" placeholder="Name" value={name} onChange={handleName} />
            </div>
            <div className="relative mb-6">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaRegCircleUser class="w-[1.15rem] h-[1.15rem] text-gray-400" />
              </div>
              <input className="input-forms" type="text" name="surname" placeholder="Surname" value={surname} onChange={handleSurname} />
            </div>
            <div className="relative mb-6">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdEmail class="w-[1.15rem] h-[1.15rem] text-gray-400" />
              </div>
              <input className="input-forms" type="email" name="email" placeholder="Email" value={email} onChange={handleEmail} />
            </div>
            <div className="relative  mb-6">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLocationDot class="w-[1.15rem] h-[1.15rem] text-gray-400" />
              </div>
              <input className="input-forms" type="text" name="address" placeholder="Address" value={address} onChange={handleAddress} />
            </div>
            <div className="relative mb-6">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaPhoneFlip class="w-[1.15rem] h-[1.15rem] text-gray-400" />
              </div>
              <input className="input-forms" type="text" name="phoneNumber" placeholder="Phone Number" value={phoneNumber} onChange={handlephoneNumber} />
            </div>
            <div className="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock class="w-[1.15rem] h-[1.15rem] text-gray-400" />
              </div>
              <input
                className="input-forms"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
              />
            </div>
            <button className="button" type="submit">Sign Up</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <p>Already have account?</p>
            <Link to={"/login"}> <p className="sign-up-link">Login</p></Link>
          </div>
        </form>


      </div>
    </div>
  );
}

export default SignupPage;
