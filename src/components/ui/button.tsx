import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    animate?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", animate = true, ...props }, ref) => {
        const buttonClasses = cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            {
                "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
                "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
                "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
                "text-primary underline-offset-4 hover:underline": variant === "link",
            },
            {
                "h-10 px-4 py-2": size === "default",
                "h-9 rounded-md px-3": size === "sm",
                "h-11 rounded-md px-8": size === "lg",
                "h-10 w-10": size === "icon",
            },
            className
        )

        // Use framer-motion animation for buttons
        if (animate) {
            const MotionButton = motion.button;
            return (
                <MotionButton
                    className={buttonClasses}
                    ref={ref}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    {...props}
                />
            )
        }

        return (
            <button
                className={buttonClasses}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }