// MobileNav — SVG icons, no emojis
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./MobileNav.css";

const HomeIcon  = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ShopIcon  = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const CartIcon  = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const HeartIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const MenuIcon  = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;

const NAV_ITEMS = [
  { label:"Home",    path:"/",       Icon:HomeIcon  },
  { label:"Shop",    path:"/shop",   Icon:ShopIcon  },
  { label:"Cart",    path:null,      Icon:CartIcon, isCart:true },
  { label:"Wishlist",path:"/wishlist",Icon:HeartIcon},
  { label:"Menu",    path:"/about",  Icon:MenuIcon  },
];

export default function MobileNav() {
  const location = useLocation();
  const { cartCount, setCartOpen, wishlist } = useApp();

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(item => {
        const isActive = item.path && location.pathname === item.path;
        if (item.isCart) {
          return (
            <button key="cart" className="mobile-nav__item" onClick={()=>setCartOpen(true)} aria-label={`Cart — ${cartCount} items`}>
              <span className="mobile-nav__icon" aria-hidden="true">
                <item.Icon/>
                {cartCount>0 && <span className="mobile-nav__badge">{cartCount}</span>}
              </span>
              <span className="mobile-nav__label">Cart</span>
            </button>
          );
        }
        return (
          <Link key={item.path} to={item.path}
            className={`mobile-nav__item${isActive?" active":""}`}
            aria-current={isActive?"page":undefined}>
            <span className="mobile-nav__icon" aria-hidden="true">
              <item.Icon/>
              {item.label==="Wishlist" && wishlist.length>0 && (
                <span className="mobile-nav__badge">{wishlist.length}</span>
              )}
            </span>
            <span className="mobile-nav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
