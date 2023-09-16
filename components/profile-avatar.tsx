"use client";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import {Avatar} from "@nextui-org/react";
import {signIn, signOut, useSession} from "next-auth/react";
import {Button} from "@nextui-org/button";

export default function ProfileAvatar() {
    const {data} = useSession();
    return (
        data?.user ? <Dropdown>
            <DropdownTrigger>
                <Avatar size="sm" isBordered color="default" src={String(data.user.image)}/>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="profile-avatar-dropdown"
                onAction={(key: any) => alert(key)}
            >
                <DropdownItem key="profile">Profile - {data.user.name}</DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
                <DropdownItem onClick={() => signOut()} key="log-out" className="text-danger" color="danger">
                    Logout
                </DropdownItem>
            </DropdownMenu>
        </Dropdown> : <Button onClick={() => signIn("google")} className="font-semibold" title="log in" size="sm" color="success">Log In</Button>
    );
}