"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronLeftIcon, ShoppingCartIcon } from "@heroicons/react/16/solid";
import { User, LogOut, ClipboardList, ChevronDown } from "lucide-react";
import { useCart } from "../context/cart-context";
import { useCustomer } from "../context/customer-context";

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  const { cart } = useCart();
  const { customer, logout } = useCustomer();

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[90%] max-w-200 z-99 top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""
          } block h-15 p-0 rounded-xl shadow-md relative ${isProfileDropdownOpen ? "overflow-visible" : "overflow-hidden"
          } will-change-[height]`}
        style={{
          backgroundColor: baseColor,
          overflow: isProfileDropdownOpen ? "visible" : undefined
        }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-15 flex items-center justify-between p-3 z-2">
          <a href="/" className="logo-container flex items-center">
            <img src={logo} alt={logoAlt} className="logo h-7.5 md:h-10" loading="lazy" />
          </a>

          <div className="flex justify-center gap-3 items-center h-full">
            {customer ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all duration-300"
                  aria-label="Profile Menu"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold text-xs border-2 border-white shadow-sm">
                    {customer.name ? customer.name[0].toUpperCase() : "U"}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-black transition-transform duration-300 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-5 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2.5 z-999 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1.5 text-left">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Masuk sebagai</p>
                      <p className="text-xs font-semibold text-gray-800 truncate mt-0.5">{customer.name}</p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{customer.email}</p>
                    </div>
                    <a
                      href="/riwayat-pesanan"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <ClipboardList className="h-4 w-4 text-gray-400" />
                      Riwayat Pesanan
                    </a>
                    <div className="border-t border-gray-100 my-1.5"></div>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="text-xs font-bold text-black hover:opacity-85 transition-opacity uppercase tracking-wider border border-gray-200 hover:border-gray-300 rounded-[calc(0.75rem-0.2rem)] px-2.5 py-1.5"
              >
                Masuk
              </a>
            )}
            <a
              href="/keranjang"
              className="card-nav-cta-button flex relative border-0 rounded-[calc(0.75rem-0.2rem)] px-3 items-center h-8.5 font-medium cursor-pointer transition-colors duration-300"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              <ShoppingCartIcon className="h-5 w-auto" />
              {cart.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </div>
              )}
            </a>
            <div
              className={`hamburger-menu ${isHamburgerOpen ? "open" : ""
                } group h-full flex flex-col items-center justify-center cursor-pointer gap-1.5`}
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              tabIndex={0}
              style={{ color: menuColor || "#000" }}
            >
              <div
                className={`hamburger-line w-7.5 h-0.5 bg-current transition-[transform,opacity,margin] duration-300 ease-linear origin-[50%_50%] ${isHamburgerOpen ? "translate-y-1 rotate-45" : ""
                  } group-hover:opacity-75`}
              />
              <div
                className={`hamburger-line w-7.5 h-0.5 bg-current transition-[transform,opacity,margin] duration-300 ease-linear origin-[50%_50%] ${isHamburgerOpen ? "-translate-y-1 -rotate-45" : ""
                  } group-hover:opacity-75`}
              />
            </div>
          </div>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-15 bottom-0 p-3 flex flex-col items-stretch gap-3 justify-start z-1 ${isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
            } md:flex-row md:items-end md:gap-0.6`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none bg-black text-white relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-15 md:h-full md:min-h-0 md:flex-[1_1_0%]"
              ref={setCardRef(idx)}
            >
              <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-1">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-1 no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                    href={lnk.href}
                    onClick={lnk.onClick}
                    aria-label={lnk.ariaLabel}
                  >
                    <ChevronLeftIcon
                      className="nav-card-link-icon shrink-0 h-5"
                      aria-hidden="true"
                    />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
