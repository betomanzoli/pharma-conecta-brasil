
import * as React from "react"
import { cn } from "@/lib/utils"

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  shouldHideOnScroll?: boolean
}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, shouldHideOnScroll, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "relative flex h-14 w-full items-center justify-between border-b bg-background px-4 py-2",
        className
      )}
      {...props}
    />
  )
)
Navbar.displayName = "Navbar"

const NavbarBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center space-x-2", className)} {...props} />
))
NavbarBrand.displayName = "NavbarBrand"

const NavbarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { justify?: "start" | "center" | "end" }
>(({ className, justify = "start", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center space-x-4",
      {
        "justify-start": justify === "start",
        "justify-center": justify === "center",
        "justify-end": justify === "end",
      },
      className
    )}
    {...props}
  />
))
NavbarContent.displayName = "NavbarContent"

const NavbarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
NavbarItem.displayName = "NavbarItem"

const NavbarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute left-0 top-full w-full bg-background border-b shadow-lg", className)}
    {...props}
  />
))
NavbarMenu.displayName = "NavbarMenu"

const NavbarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-4 py-2 hover:bg-muted", className)} {...props} />
))
NavbarMenuItem.displayName = "NavbarMenuItem"

const NavbarMenuToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { "aria-label"?: string }
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("flex items-center justify-center p-2 hover:bg-muted rounded", className)}
    {...props}
  >
    {children}
  </button>
))
NavbarMenuToggle.displayName = "NavbarMenuToggle"

export {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
}
