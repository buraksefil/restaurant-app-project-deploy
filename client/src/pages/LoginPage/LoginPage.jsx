import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";
import { MdEmail } from "react-icons/md"
import { FaLock } from "react-icons/fa6"

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    // Send a request to the server using axios
    /* 
    axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`)
      .then((response) => {})
    */

    // Or using a service
    authService
      .login(requestBody)
      .then((response) => {
        // If the POST request is successful store the authentication token,
        // after the token is stored authenticate the user
        // and at last navigate to the home page
        storeToken(response.data.authToken);
        authenticateUser();
      })
      .catch((error) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="mainlogin">
      <div className="LoginPage">
        <h1>Login</h1>

        <form id="form" onSubmit={handleLoginSubmit}>
          <div className="inputwrap">
            <div className="relative mt-6 mb-6">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdEmail class="w-[1.15rem] h-[1.15rem] text-gray-400" />
              </div>
              <input className="input-forms" type="email" name="email" placeholder="Email" value={email} onChange={handleEmail} />
            </div>
            <div className="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock class="w-[1.15rem] h-[1.15rem] text-gray-400" />
              </div>
              <input
                className="input-forms"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePassword}
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="button" type="submit">Login</button>
            <p>Don't have an account yet?</p>
            <Link to={"/signup"}> <p className="sign-up-link">Sign Up</p></Link>
          </div>
        </form>



      </div>
    </div>
  );
}

export default LoginPage;
