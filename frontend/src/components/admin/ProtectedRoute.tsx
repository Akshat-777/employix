"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useSelector((store: RootState) => store.auth);
    const router = useRouter();

    useEffect(() => {
        if (user === null || user.role !== 'recruiter') {
            router.push("/");
        }
    }, [user, router]);

    if (user === null || user.role !== 'recruiter') {
        return null; // Or a loading spinner
    }

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;
