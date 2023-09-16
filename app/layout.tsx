"use client";
import RootLayout from "@/app/root-layout";
import {trpc} from "@/app/trpc";

export default trpc.withTRPC(RootLayout);