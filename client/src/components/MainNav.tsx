import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const links = [
    { path: "/home", label: "Dashboard" },
    { path: "/transactions", label: "Transactions" },
    { path: "/accounts", label: "Accounts" },
    { path: "/networth", label: "Networth"},
    { path: "/recurring", label: "Recurring" }
    //{ path: "/spending", label: "Spending" },
    //{ path: "/budgets", label: "Budgets" },
    //{ path: "/net-worth", label: "Net Worth" },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {links.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            cn("text-md font-medium transition-colors hover:text-primary",
               { "text-primary": isActive, "text-muted-foreground": !isActive })
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}