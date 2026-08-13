"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronLeftIcon, ShoppingCartIcon } from "@heroicons/react/16/solid";
import { LogOut, ClipboardList, ChevronDown, Bell, Package } from "lucide-react";
import { useCart } from "../context/cart-context";
import { useCustomer } from "../context/customer-context";
import {
  getCustomerNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../actions/notification";

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

  // ── Notifikasi state ──────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Hooks konteks ─────────────────────────────────────────────────────────
  const { cart } = useCart();
  const { customer, logout } = useCustomer();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ── Load notifikasi + polling setiap 30 detik ─────────────────────────────
  useEffect(() => {
    if (!customer) {
      setNotifications([]);
      return;
    }
    const load = async () => {
      const res = await getCustomerNotifications();
      if (res.success) setNotifications(res.notifications);
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [customer]);

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

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[92%] max-w-200 z-99 top-[1.2em] md:top-[1.8em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""
          } block h-15 p-0 rounded-2xl shadow-lg shadow-black/10 relative ${isProfileDropdownOpen || isNotifOpen ? "overflow-visible" : "overflow-hidden"
          } will-change-[height] border border-blackprimary/80`}
        style={{
          backgroundColor: baseColor,
          backdropFilter: "blur(12px)",
          overflow: isProfileDropdownOpen || isNotifOpen ? "visible" : undefined
        }}
      >
        {/* ── Top Bar ───────────────────────────────────────────────────────── */}
        <div className="card-nav-top absolute inset-x-0 top-0 h-15 flex items-center justify-between px-4 z-2">
          <a href="/" className="logo-container flex items-center">
            <img src={logo} alt={logoAlt} className="logo h-7.5 md:h-10" loading="lazy" />
          </a>

          <div className="flex justify-center gap-2.5 items-center h-full">

            {/* ── Bell Notifikasi ─────────────────────────────── */}
            {customer && (
              <div className="relative" ref={notifDropdownRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-black/10 hover:border-blueprimary/40 hover:bg-blueprimary/5 transition-all duration-200 relative cursor-pointer"
                  aria-label="Notifikasi"
                >
                  <Bell className="h-4 w-4 text-blackprimary/70" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-redprimary text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-extrabold leading-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <>
                    {/* Overlay mobile */}
                    <div
                      className="fixed inset-0 z-[998] md:hidden"
                      onClick={() => setIsNotifOpen(false)}
                    />
                    <div
                      className={[
                        "fixed left-3 right-3 top-[74px] z-[999]",
                        "md:absolute md:left-auto md:right-0 md:top-auto md:mt-4 md:w-80 md:inset-auto",
                        "bg-white rounded-2xl shadow-xl shadow-black/10 border border-black/8 py-2",
                        "animate-in fade-in slide-in-from-top-2 duration-200",
                      ].join(" ")}
                    >
                      {/* Header dropdown notif */}
                      <div className="px-4 pb-2.5 pt-1 border-b border-black/8 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blueprimary flex items-center justify-center">
                            <Bell className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-bold text-blackprimary">Notifikasi</span>
                          {unreadCount > 0 && (
                            <span className="bg-blueprimary/10 text-blueprimary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount} baru
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={async () => {
                              await markAllNotificationsAsRead();
                              setNotifications((prev) =>
                                prev.map((n) => ({ ...n, isRead: true }))
                              );
                            }}
                            className="text-[10px] font-bold text-blueprimary hover:text-blueprimary/70 transition-colors cursor-pointer"
                          >
                            Tandai semua
                          </button>
                        )}
                      </div>

                      {/* List notifikasi */}
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-10 text-center">
                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-2">
                              <Bell className="w-5 h-5 text-black/25" />
                            </div>
                            <p className="text-xs text-black/40 font-medium">Belum ada notifikasi</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <a
                              key={notif.id}
                              href={`/riwayat-pesanan`}
                              onClick={async () => {
                                if (!notif.isRead) {
                                  await markNotificationAsRead(notif.id);
                                  setNotifications((prev) =>
                                    prev.map((n) =>
                                      n.id === notif.id ? { ...n, isRead: true } : n
                                    )
                                  );
                                }
                                setIsNotifOpen(false);
                              }}
                              className={`flex px-4 py-3 border-b border-black/5 last:border-b-0 hover:bg-black/[0.03] transition-colors ${
                                !notif.isRead ? "bg-blueprimary/[0.04]" : ""
                              }`}
                            >
                              <div className="flex gap-2.5 items-start w-full">
                                {!notif.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-blueprimary mt-1.5 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-blackprimary break-words">{notif.title}</p>
                                  <p className="text-[11px] text-black/50 mt-0.5 leading-relaxed break-words">{notif.message}</p>
                                  <p className="text-[9px] text-black/35 mt-1 font-semibold">
                                    {new Date(notif.createdAt).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </a>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Profile Dropdown ─────────────────────────────── */}
            {customer ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition-all duration-300"
                  aria-label="Profile Menu"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blueprimary text-white font-black text-sm shadow-md shadow-blueprimary/30">
                    {customer.name ? customer.name[0].toUpperCase() : "U"}
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-blackprimary/50 transition-transform duration-300 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl shadow-black/10 border border-black/8 py-2 z-999 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-black/8 mb-1">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blueprimary text-white font-black text-sm flex items-center justify-center shadow-sm">
                          {customer.name ? customer.name[0].toUpperCase() : "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-blackprimary truncate">{customer.name}</p>
                          <p className="text-[10px] text-black/45 truncate">{customer.email}</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href="/riwayat-pesanan"
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-blackprimary/75 hover:text-blackprimary hover:bg-black/[0.03] transition-colors rounded-lg mx-1"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blueprimary/10 flex items-center justify-center">
                          <Package className="h-3.5 w-3.5 text-blueprimary" />
                        </div>
                        Riwayat Pesanan
                      </div>
                      {unreadCount > 0 && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-redprimary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-redprimary"></span>
                        </span>
                      )}
                    </a>

                    <div className="border-t border-black/8 my-1.5 mx-4"></div>

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-redprimary hover:bg-redprimary/5 transition-colors rounded-lg mx-0 text-left cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-md bg-redprimary/10 flex items-center justify-center">
                        <LogOut className="h-3.5 w-3.5 text-redprimary" />
                      </div>
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="text-xs font-bold text-blackprimary border border-black/12 hover:border-blueprimary hover:text-blueprimary transition-all duration-200 uppercase tracking-wider rounded-xl px-3.5 py-2"
              >
                Login
              </a>
            )}

            {/* ── Cart ──────────────────────────────────────────── */}
            <a
              href="/keranjang"
              className="card-nav-cta-button flex relative rounded-xl px-3 items-center h-9 font-bold cursor-pointer transition-all duration-200 bg-blueprimary hover:bg-blueprimary/90 text-white shadow-md shadow-blueprimary/25 hover:shadow-blueprimary/40"
            >
              <ShoppingCartIcon className="h-4.5 w-auto" />
              {cart.length > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-redprimary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black shadow-sm">
                  {cart.length}
                </div>
              )}
            </a>

            {/* ── Hamburger ─────────────────────────────────────── */}
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
                className={`hamburger-line w-7 h-0.5 bg-current transition-[transform,opacity,margin] duration-300 ease-linear origin-[50%_50%] ${isHamburgerOpen ? "translate-y-1 rotate-45" : ""
                  } group-hover:opacity-60`}
              />
              <div
                className={`hamburger-line w-7 h-0.5 bg-current transition-[transform,opacity,margin] duration-300 ease-linear origin-[50%_50%] ${isHamburgerOpen ? "-translate-y-1 -rotate-45" : ""
                  } group-hover:opacity-60`}
              />
            </div>
          </div>
        </div>

        {/* ── Nav Cards (expanded) ──────────────────────────────────────────── */}
        <div
          className={`card-nav-content absolute left-0 right-0 top-15 bottom-0 p-3 flex flex-col items-stretch gap-3 justify-start z-1 ${isExpanded
            ? "visible pointer-events-auto"
            : "invisible pointer-events-none"
            } md:flex-row md:items-end md:gap-2`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className={`nav-card select-none ${item.bgColor} ${item.textColor} relative flex flex-col gap-2 p-[12px_16px] rounded-xl min-w-0 flex-[1_1_auto] h-auto min-h-15 md:h-full md:min-h-0 md:flex-[1_1_0%]`}
              ref={setCardRef(idx)}
            >
              <div className="nav-card-label font-semibold tracking-[-0.5px] text-[18px] md:text-[20px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-1">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-1 no-underline cursor-pointer transition-opacity duration-300 hover:opacity-70 text-[14px] md:text-[15px]"
                    href={lnk.href}
                    onClick={lnk.onClick}
                    aria-label={lnk.ariaLabel}
                  >
                    <ChevronLeftIcon
                      className="nav-card-link-icon shrink-0 h-4"
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
