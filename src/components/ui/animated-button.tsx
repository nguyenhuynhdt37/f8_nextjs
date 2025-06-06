'use client';

import * as React from "react";
import { motion } from "@/lib/motion";
import { Button, ButtonProps } from "./button";

export interface AnimatedButtonProps extends ButtonProps {
    animateScale?: boolean;
    animateHover?: number;
    animateTap?: number;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({
        children,
        className,
        animateScale = true,
        animateHover = 1.03,
        animateTap = 0.97,
        ...props
    }, ref) => {
        return (
            <motion.div
                whileHover={animateScale ? { scale: animateHover } : undefined}
                whileTap={animateScale ? { scale: animateTap } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <Button ref={ref} className={className} {...props}>
                    {children}
                </Button>
            </motion.div>
        );
    }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
