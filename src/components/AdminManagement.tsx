import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageSquare, Clock, Users, Eye } from "lucide-react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppPage, PageHeader } from "@/components/ui/app-shell";

interface ChatSession {
  id: string;
  seekerName: string;
  helperName: string;
  userIssue: string;
  status: "Open" | "Closed";
  messageCount: number;
}

const AdminManagement = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);


  const handleViewMessages = async (chatId: string) => {
    try {
      const messagesSnapshot = await getDocs(
        collection(db, "esupport", chatId, "messages")
      );
      const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
      setSelectedMessages(messagesData);
      setSelectedChatId(chatId);
      setShowMessages(true);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      const snapshot = await getDocs(collection(db, "esupport"));
      const data: ChatSession[] = [];
      console.log("Total esupport documents:", snapshot.size);

      for (const docSnap of snapshot.docs) {
        try {
          const docData = docSnap.data();
          if (!docData.seeker_uid || !docData.helper_uid) {
            console.warn("Missing seeker/helper UID in doc:", docSnap.id);
            continue;
          }

          const seekerSnap = await getDoc(doc(db, "users", docData.seeker_uid));
          const helperSnap = await getDoc(doc(db, "users", docData.helper_uid));

          const seekerName =
            seekerSnap.exists() && seekerSnap.data().username
              ? seekerSnap.data().username
              : "Unknown Seeker";
          const helperName =
            helperSnap.exists() && helperSnap.data().username
              ? helperSnap.data().username
              : "Unknown Supporter";

          const messagesSnap = await getDocs(
            collection(db, "esupport", docSnap.id, "messages")
          );
          const messageCount = messagesSnap.size;

          console.log(
            "Seeker:",
            seekerName,
            "Helper:",
            helperName,
            "Messages:",
            messageCount
          );

          data.push({
            id: docSnap.id,
            seekerName,
            helperName,
            userIssue: docData.type,
            status: typeof docData.actual === "number" ? "Closed" : "Open",
            messageCount,
          });
        } catch (err) {
          console.error("Error processing chat doc", docSnap.id, err);
        }
      }
      console.log("Chat sessions:", data);

      setChatSessions(data);
    };

    fetchChats();
  }, []);

  const activeChatCount = chatSessions.filter(
    (chat) => chat.status === "Open"
  ).length;
  const pendingChatCount = 0;
  const totalChats = chatSessions.length;

  return (
    <AppPage width="wide">
      <PageHeader
        margin="admin"
        title="Admin"
        description="Monitor wellness chat sessions."
      />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Chats
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-signal">
                {activeChatCount}
              </div>
              <p className="text-xs text-chalk-3">Currently ongoing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Chats
              </CardTitle>
              <Clock className="h-4 w-4 text-brass" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brass">
                {pendingChatCount}
              </div>
              <p className="text-xs text-chalk-3">Waiting for response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sessions
              </CardTitle>
              <Users className="h-4 w-4 text-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sage">
                {totalChats}
              </div>
              <p className="text-xs text-chalk-3">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Chat Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chat ID</TableHead>
                  <TableHead>Seeker</TableHead>
                  <TableHead>Supporter</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chatSessions.map((chat) => (
                  <TableRow key={chat.id}>
                    <TableCell className="font-mono text-sm">
                      {chat.id}
                    </TableCell>
                    <TableCell>
                      {chat.seekerName}
                    </TableCell>
                    <TableCell>
                      {chat.helperName}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {chat.userIssue}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-notice px-2 py-1 text-xs font-medium ${
                          chat.status === "Open"
                            ? "bg-signal-wash text-signal"
                            : "bg-notice text-chalk-2"
                        }`}
                      >
                        {chat.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {chat.messageCount}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewMessages(chat.id)}
                        className="rounded-control p-1 hover:bg-notice"
                        title="View Messages"
                      >
                        <Eye className="h-4 w-4 text-chalk-2" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {showMessages && (
          <div className="mt-8 border border-rule bg-notice p-4">
            <h2 className="mb-2 text-lg font-semibold text-chalk">
              Messages for Chat ID: {selectedChatId}
            </h2>
            <div className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto">
              {selectedMessages.map((msg, idx) => (
                <div key={idx} className="border-b border-rule pb-2 text-sm">
                  <p>
                    <span className="font-medium text-chalk">
                      {msg.user?.name || "Unknown"}
                    </span>{" "}
                    at{" "}
                    <span className="numeric text-chalk-3">
                      {new Date(msg.createdAt?.seconds * 1000).toLocaleString()}
                    </span>
                    :
                  </p>
                  <p className="text-chalk-2">{msg.content}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowMessages(false)}
              className="mt-4 text-sm text-sage underline-offset-4 hover:underline"
            >
              Close
            </button>
          </div>
        )}
    </AppPage>
  );
};

export default AdminManagement;
