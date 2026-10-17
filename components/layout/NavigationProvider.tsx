"use client";
import { createContext, useContext, type ReactNode } from "react";
import { navigationDefaults } from "../../sanity/lib/navigation-data";
import type { NavigationContent } from "../../sanity/lib/navigation-mapping";
const NavigationContext = createContext<NavigationContent>(navigationDefaults);
export function NavigationProvider({ value, children }: { value: NavigationContent; children: ReactNode }) { return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>; }
export const useNavigation = () => useContext(NavigationContext);
