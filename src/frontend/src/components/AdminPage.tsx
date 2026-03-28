import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  LogIn,
  LogOut,
  RefreshCw,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleString();
}

type AdminTab = "signups" | "suggestions";

export default function AdminPage() {
  const { actor, isFetching: actorLoading } = useActor();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("signups");

  const { data: isAdmin, isLoading: adminCheckLoading } = useQuery({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorLoading && isLoggedIn,
  });

  const {
    data: signups = [],
    isLoading: signupsLoading,
    refetch: refetchSignups,
  } = useQuery({
    queryKey: ["signups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSignups();
    },
    enabled: !!actor && !actorLoading && isAdmin === true,
  });

  const {
    data: suggestions = [],
    isLoading: suggestionsLoading,
    refetch: refetchSuggestions,
  } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSuggestions();
    },
    enabled: !!actor && !actorLoading && isAdmin === true,
  });

  const clearSignupsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.clearSignups();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signups"] });
    },
  });

  const clearSuggestionsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.clearSuggestions();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  const principalId = identity?.getPrincipal().toString() ?? "";

  function handleCopy() {
    if (!principalId) return;
    navigator.clipboard.writeText(principalId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const tabStyle = (tab: AdminTab) => ({
    paddingBottom: "10px",
    marginBottom: "-1px",
    fontSize: "14px",
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? "#f5f5f5" : "#666666",
    background: "none",
    border: "none",
    borderBottom:
      activeTab === tab ? "2px solid #7c6eea" : "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s",
    paddingLeft: "4px",
    paddingRight: "4px",
  });

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <header
        data-ocid="admin.panel"
        style={{
          borderBottom: "1px solid #242424",
          background: "rgba(13,13,13,0.95)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="max-w-6xl mx-auto px-8 flex items-center justify-between"
          style={{ height: "64px" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #7c6eea, #9b90f0)",
                color: "#f5f5f5",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              C
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{
                color: "#f5f5f5",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Clario
            </span>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(124,110,234,0.15)",
                border: "1px solid rgba(124,110,234,0.3)",
                color: "#9b90f0",
              }}
            >
              <Shield size={11} />
              Admin
            </div>
          </div>

          <button
            type="button"
            data-ocid="admin.link"
            onClick={() => {
              window.location.hash = "";
            }}
            className="flex items-center gap-2 text-sm transition-colors hover:text-white"
            style={{ color: "#666666" }}
          >
            <ArrowLeft size={14} />
            Back to site
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {!isLoggedIn ? (
          /* Login section */
          <div
            data-ocid="admin.card"
            className="max-w-md mx-auto text-center py-20"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: "rgba(124,110,234,0.12)",
                border: "1px solid rgba(124,110,234,0.2)",
              }}
            >
              <Shield size={28} style={{ color: "#9b90f0" }} />
            </div>
            <h1
              className="text-2xl font-semibold mb-3"
              style={{
                color: "#f5f5f5",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Admin Access
            </h1>
            <p className="text-sm mb-8" style={{ color: "#666666" }}>
              Sign in to view all Clario signups and suggestions.
            </p>
            <button
              type="button"
              data-ocid="admin.primary_button"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #7c6eea 0%, #9b90f0 100%)",
                color: "#f5f5f5",
                boxShadow: "0 0 24px rgba(124,110,234,0.25)",
              }}
            >
              {isLoggingIn ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <LogIn size={15} />
              )}
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </button>
          </div>
        ) : adminCheckLoading ? (
          /* Loading admin check */
          <div
            data-ocid="admin.loading_state"
            className="flex items-center justify-center py-20"
          >
            <Loader2
              size={28}
              className="animate-spin"
              style={{ color: "#9b90f0" }}
            />
          </div>
        ) : isAdmin === false ? (
          /* Not admin */
          <div
            data-ocid="admin.error_state"
            className="max-w-lg mx-auto text-center py-20"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <Shield size={22} style={{ color: "#ef4444" }} />
            </div>
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: "#f5f5f5" }}
            >
              Access Denied
            </p>
            <p className="text-sm mb-8" style={{ color: "#666666" }}>
              You don&apos;t have admin access yet. Contact the Clario team.
            </p>

            {/* Principal ID box */}
            <div
              className="text-left rounded-xl p-5 mb-6"
              style={{
                background: "rgba(124,110,234,0.07)",
                border: "1px solid rgba(124,110,234,0.25)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#9b90f0" }}
              >
                Your Principal ID
              </p>
              <div className="flex items-center gap-2">
                <code
                  className="flex-1 text-xs break-all select-all"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', 'Fira Mono', 'Menlo', monospace",
                    color: "#e0ddfb",
                    lineHeight: 1.6,
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    border: "1px solid rgba(124,110,234,0.15)",
                    display: "block",
                  }}
                >
                  {principalId}
                </code>
                <button
                  type="button"
                  data-ocid="admin.secondary_button"
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                  style={{
                    background: copied
                      ? "rgba(124,110,234,0.25)"
                      : "rgba(124,110,234,0.1)",
                    border: "1px solid rgba(124,110,234,0.3)",
                    color: copied ? "#9b90f0" : "#7c6eea",
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
              <p className="text-xs mt-3" style={{ color: "#555555" }}>
                Send this to the admin to get access.
              </p>
            </div>

            <button
              type="button"
              data-ocid="admin.toggle"
              onClick={() => clear()}
              className="flex items-center gap-2 mx-auto text-sm transition-colors hover:text-white"
              style={{ color: "#666666" }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        ) : (
          /* Admin dashboard */
          <div data-ocid="admin.section">
            {/* Tabs */}
            <div
              className="flex items-center gap-6 mb-8"
              style={{ borderBottom: "1px solid #242424" }}
            >
              <button
                type="button"
                data-ocid="admin.tab"
                onClick={() => setActiveTab("signups")}
                style={tabStyle("signups")}
              >
                Signups
                <span
                  className="ml-2 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    background: "rgba(124,110,234,0.15)",
                    color: "#9b90f0",
                  }}
                >
                  {signups.length}
                </span>
              </button>
              <button
                type="button"
                data-ocid="admin.tab"
                onClick={() => setActiveTab("suggestions")}
                style={tabStyle("suggestions")}
              >
                Suggestions
                <span
                  className="ml-2 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    background: "rgba(124,110,234,0.15)",
                    color: "#9b90f0",
                  }}
                >
                  {suggestions.length}
                </span>
              </button>
            </div>

            {/* ── Signups Tab ── */}
            {activeTab === "signups" && (
              <div>
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1
                      className="text-2xl font-semibold mb-1"
                      style={{
                        color: "#f5f5f5",
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      Signups
                    </h1>
                    <p className="text-sm" style={{ color: "#666666" }}>
                      {signupsLoading
                        ? "Loading..."
                        : `${signups.length} total signup${
                            signups.length !== 1 ? "s" : ""
                          }`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      data-ocid="admin.secondary_button"
                      onClick={() => refetchSignups()}
                      disabled={signupsLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:bg-white/5 disabled:opacity-40"
                      style={{
                        border: "1px solid #2e2e2e",
                        color: "#a0a0a0",
                      }}
                    >
                      <RefreshCw
                        size={13}
                        className={signupsLoading ? "animate-spin" : ""}
                      />
                      Refresh
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          data-ocid="admin.delete_button"
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:bg-red-950/30"
                          style={{
                            border: "1px solid rgba(239,68,68,0.25)",
                            color: "#ef4444",
                          }}
                        >
                          <Trash2 size={13} />
                          Clear All
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        data-ocid="admin.dialog"
                        style={{
                          background: "#141414",
                          border: "1px solid #2e2e2e",
                          color: "#f5f5f5",
                        }}
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle style={{ color: "#f5f5f5" }}>
                            Clear all signups?
                          </AlertDialogTitle>
                          <AlertDialogDescription style={{ color: "#666666" }}>
                            This will permanently delete all {signups.length}{" "}
                            signup{signups.length !== 1 ? "s" : ""}. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            data-ocid="admin.cancel_button"
                            style={{
                              background: "transparent",
                              border: "1px solid #2e2e2e",
                              color: "#a0a0a0",
                            }}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            data-ocid="admin.confirm_button"
                            onClick={() => clearSignupsMutation.mutate()}
                            disabled={clearSignupsMutation.isPending}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                            }}
                          >
                            {clearSignupsMutation.isPending ? (
                              <Loader2
                                size={13}
                                className="animate-spin mr-2"
                              />
                            ) : null}
                            Yes, clear all
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <button
                      type="button"
                      data-ocid="admin.secondary_button"
                      onClick={() => clear()}
                      className="flex items-center gap-2 text-xs transition-colors hover:text-white"
                      style={{ color: "#444444" }}
                    >
                      <LogOut size={13} />
                      Sign out
                    </button>
                  </div>
                </div>

                {/* Table */}
                {signupsLoading ? (
                  <div
                    data-ocid="admin.loading_state"
                    className="flex items-center justify-center py-16"
                  >
                    <Loader2
                      size={24}
                      className="animate-spin"
                      style={{ color: "#9b90f0" }}
                    />
                  </div>
                ) : signups.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="text-center py-16"
                    style={{
                      border: "1px solid #242424",
                      borderRadius: "4px",
                      color: "#444444",
                    }}
                  >
                    <p className="text-sm">No signups yet.</p>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #242424",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow
                          data-ocid="admin.row"
                          style={{ borderBottom: "1px solid #242424" }}
                        >
                          <TableHead style={{ color: "#444444", width: 60 }}>
                            #
                          </TableHead>
                          <TableHead style={{ color: "#444444" }}>
                            Email
                          </TableHead>
                          <TableHead style={{ color: "#444444" }}>
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {signups.map((signup, i) => (
                          <TableRow
                            key={signup.email + signup.timestamp.toString()}
                            data-ocid={`admin.item.${i + 1}`}
                            style={{ borderBottom: "1px solid #1a1a1a" }}
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            <TableCell
                              style={{ color: "#444444", fontSize: 12 }}
                            >
                              {i + 1}
                            </TableCell>
                            <TableCell
                              style={{ color: "#f5f5f5", fontSize: 13 }}
                            >
                              {signup.email}
                            </TableCell>
                            <TableCell
                              style={{ color: "#666666", fontSize: 12 }}
                            >
                              {formatTimestamp(signup.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {/* ── Suggestions Tab ── */}
            {activeTab === "suggestions" && (
              <div>
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1
                      className="text-2xl font-semibold mb-1"
                      style={{
                        color: "#f5f5f5",
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      Suggestions
                    </h1>
                    <p className="text-sm" style={{ color: "#666666" }}>
                      {suggestionsLoading
                        ? "Loading..."
                        : `${suggestions.length} suggestion${
                            suggestions.length !== 1 ? "s" : ""
                          }`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      data-ocid="admin.secondary_button"
                      onClick={() => refetchSuggestions()}
                      disabled={suggestionsLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:bg-white/5 disabled:opacity-40"
                      style={{
                        border: "1px solid #2e2e2e",
                        color: "#a0a0a0",
                      }}
                    >
                      <RefreshCw
                        size={13}
                        className={suggestionsLoading ? "animate-spin" : ""}
                      />
                      Refresh
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          data-ocid="admin.delete_button"
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:bg-red-950/30"
                          style={{
                            border: "1px solid rgba(239,68,68,0.25)",
                            color: "#ef4444",
                          }}
                        >
                          <Trash2 size={13} />
                          Clear All
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        data-ocid="admin.dialog"
                        style={{
                          background: "#141414",
                          border: "1px solid #2e2e2e",
                          color: "#f5f5f5",
                        }}
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle style={{ color: "#f5f5f5" }}>
                            Clear all suggestions?
                          </AlertDialogTitle>
                          <AlertDialogDescription style={{ color: "#666666" }}>
                            This will permanently delete all{" "}
                            {suggestions.length} suggestion
                            {suggestions.length !== 1 ? "s" : ""}. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            data-ocid="admin.cancel_button"
                            style={{
                              background: "transparent",
                              border: "1px solid #2e2e2e",
                              color: "#a0a0a0",
                            }}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            data-ocid="admin.confirm_button"
                            onClick={() => clearSuggestionsMutation.mutate()}
                            disabled={clearSuggestionsMutation.isPending}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                            }}
                          >
                            {clearSuggestionsMutation.isPending ? (
                              <Loader2
                                size={13}
                                className="animate-spin mr-2"
                              />
                            ) : null}
                            Yes, clear all
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <button
                      type="button"
                      data-ocid="admin.secondary_button"
                      onClick={() => clear()}
                      className="flex items-center gap-2 text-xs transition-colors hover:text-white"
                      style={{ color: "#444444" }}
                    >
                      <LogOut size={13} />
                      Sign out
                    </button>
                  </div>
                </div>

                {/* Table */}
                {suggestionsLoading ? (
                  <div
                    data-ocid="admin.loading_state"
                    className="flex items-center justify-center py-16"
                  >
                    <Loader2
                      size={24}
                      className="animate-spin"
                      style={{ color: "#9b90f0" }}
                    />
                  </div>
                ) : suggestions.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="text-center py-16"
                    style={{
                      border: "1px solid #242424",
                      borderRadius: "4px",
                      color: "#444444",
                    }}
                  >
                    <p className="text-sm">No suggestions yet.</p>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #242424",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow
                          data-ocid="admin.row"
                          style={{ borderBottom: "1px solid #242424" }}
                        >
                          <TableHead style={{ color: "#444444", width: 60 }}>
                            #
                          </TableHead>
                          <TableHead style={{ color: "#444444" }}>
                            Suggestion
                          </TableHead>
                          <TableHead
                            style={{ color: "#444444", whiteSpace: "nowrap" }}
                          >
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {suggestions.map((suggestion, i) => (
                          <TableRow
                            key={
                              suggestion.text + suggestion.timestamp.toString()
                            }
                            data-ocid={`admin.item.${i + 1}`}
                            style={{ borderBottom: "1px solid #1a1a1a" }}
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            <TableCell
                              style={{ color: "#444444", fontSize: 12 }}
                            >
                              {i + 1}
                            </TableCell>
                            <TableCell
                              style={{
                                color: "#f5f5f5",
                                fontSize: 13,
                                maxWidth: 480,
                              }}
                            >
                              <p
                                style={{
                                  whiteSpace: "pre-wrap",
                                  lineHeight: 1.6,
                                }}
                              >
                                {suggestion.text}
                              </p>
                            </TableCell>
                            <TableCell
                              style={{
                                color: "#666666",
                                fontSize: 12,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatTimestamp(suggestion.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
