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
import { useSidebar } from "./SideBar";

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

  const { collapsed } = useSidebar();

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
    <div
      className={`min-h-screen bg-gray-50 p-6 ${
        collapsed ? "pl-[74px] sm:pl-[96px]" : "pl-[220px] xl:pl-[280px]"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage and monitor all chat sessions</p>
        </div>

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
              <div className="text-2xl font-bold text-green-600">
                {activeChatCount}
              </div>
              <p className="text-xs text-gray-800">Currently ongoing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Chats
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingChatCount}
              </div>
              <p className="text-xs text-gray-800">Waiting for response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sessions
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalChats}
              </div>
              <p className="text-xs text-gray-800">All time</p>
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
                    <TableCell className="text-gray-900">
                      {chat.seekerName}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {chat.helperName}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-900">
                      {chat.userIssue}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chat.status === "Open"
                            ? "text-green-600 bg-green-50"
                            : "text-gray-600 bg-gray-50"
                        }`}
                      >
                        {chat.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {chat.messageCount}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewMessages(chat.id)}
                        className="p-1 rounded hover:bg-gray-200"
                        title="View Messages"
                      >
                        <Eye className="h-4 w-4 text-gray-700" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {showMessages && (
          <div className="mt-8 bg-white p-4 rounded shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">
              Messages for Chat ID: {selectedChatId}
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedMessages.map((msg, idx) => (
                <div key={idx} className="text-sm border-b pb-2">
                  <p>
                    <span className="font-medium">
                      {msg.user?.name || "Unknown"}
                    </span>{" "}
                    at{" "}
                    <span className="text-gray-500">
                      {new Date(msg.createdAt?.seconds * 1000).toLocaleString()}
                    </span>
                    :
                  </p>
                  <p className="text-gray-800">{msg.content}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowMessages(false)}
              className="mt-4 text-blue-600 hover:underline text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
