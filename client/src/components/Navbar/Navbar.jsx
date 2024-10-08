import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { BiLogOut, BiListPlus, BiListUl, BiSolidDiscount, BiSolidCategoryAlt } from 'react-icons/bi';
import { MdCampaign } from 'react-icons/md'
import { BsFillPersonFill } from 'react-icons/bs'

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser, isAdmin } = useContext(AuthContext);

  return (
    <nav className="navbar">

      <Link to="/"><img src={"./logo.png"} width={"250px"}></img></Link>
      {user ? (<h3>Bem-vindo {user.name} {user.surname}</h3>) : (<h3>Bem-vindo</h3>)}
      <div className="buttons-main">
        {isLoggedIn && (
          <>
            {isAdmin && (<Link to="/items">
              <button className="button-menu"> <BiListUl className="icons" /> Items</button>
            </Link>)}
            {isAdmin && (<Link to="/createitem">
              <button className="button-menu"><BiListPlus className="icons" />Create Item</button>
            </Link>)}
            {isAdmin && (<Link to="/discounts/coupons">
              <button className="button-menu"><BiSolidDiscount className="icons" />Cupões</button>
            </Link>)}
            {isAdmin && (<Link to="/createcoupon">
              <button className="button-menu"><BiListPlus className="icons" />Create Coupon</button>
            </Link>)}
            {isAdmin && (<Link to="/discounts/campaigns">
              <button className="button-menu"><MdCampaign className="icons" />Campanhas</button>
            </Link>)}
            {isAdmin && (<Link to="/createcampaign">
              <button className="button-menu"><BiListPlus className="icons" />Create Campanhas</button>
            </Link>)}
            {isAdmin && (<Link to="/dietary">
              <button className="button-menu"><BiSolidCategoryAlt className="icons" />Categorias</button>
            </Link>)}
            {isAdmin && (<Link to="/createdietary">
              <button className="button-menu"><BiListPlus className="icons" />Create Categorias</button>
            </Link>)}
            <Link to="/profile">
              <button className="button-menu"><BsFillPersonFill className="icons" />Perfil</button>
            </Link>
            <button onClick={logOutUser} className="button-menu"> <BiLogOut className="icons" /> Sair</button>
          </>
        )
        }
      </div>
      {
        !isLoggedIn && (
          <>
            <Link to="/login">
              <button className="button-menu">Login</button>
            </Link>
            <Link to="/signup">
              <button className="button-menu">Registar</button>
            </Link>
          </>
        )
      }
    </nav >
  );
}

export default Navbar;
