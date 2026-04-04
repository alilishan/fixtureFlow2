import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { CreateUserDialog, DeleteUserButton } from "./_components/user-dialogs"

const roleLabel: Record<string, string> = {
    ORGANISER: "Organiser",
    COACH: "Coach",
    VIEWER: "Viewer",
}

const roleBadge: Record<string, string> = {
    ORGANISER: "text-primary",
    COACH: "text-foreground",
    VIEWER: "text-muted-foreground",
}

export default async function UsersPage() {
    const session = await auth()
    const users = await db.user.findMany({ orderBy: { createdAt: "asc" } })

    return (
        <div>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="font-sans text-base font-light text-muted-foreground">
                        Admin accounts
                    </p>
                </div>
                <CreateUserDialog />
            </div>

            <div className="border border-border">
                <table className="table-sport w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="text-left">Name</th>
                            <th className="text-left">Email</th>
                            <th className="text-left">Role</th>
                            <th className="text-left hidden sm:table-cell">Joined</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="font-medium">
                                    {user.name}
                                    {user.id === session?.user?.id && (
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            (you)
                                        </span>
                                    )}
                                </td>
                                <td className="text-muted-foreground text-sm">{user.email}</td>
                                <td>
                                    <span
                                        className={`text-xs uppercase tracking-widest font-medium ${roleBadge[user.role]}`}
                                    >
                                        {roleLabel[user.role]}
                                    </span>
                                </td>
                                <td className="text-muted-foreground text-sm hidden sm:table-cell">
                                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="text-right">
                                    {user.id !== session?.user?.id && (
                                        <DeleteUserButton
                                            userId={user.id}
                                            userName={user.name ?? user.email}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
