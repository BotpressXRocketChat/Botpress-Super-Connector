import {
  createDirectRoom,
  sendMessage,
  sendNotification,
  conversate,
  getChatSession,
  getChatThreadId,
  reverseRoomTypeMapper,
} from "../../helpers/Utility";

jest.mock("@rocket.chat/apps-engine/definition/accessors", () => ({
  ...jest.requireActual("@rocket.chat/apps-engine/definition/accessors"),
  IModify: {
    Creator: class CreatorMock {
      startRoom() {
        return this;
      }
      setType() {
        return this;
      }
      setCreator() {
        return this;
      }
      setMembersToBeAddedByUsernames() {
        return this;
      }
      finish() {
        return "mockedRoomId";
      }
      startMessage() {
        return this;
      }
      setText() {
        return this;
      }
      setBlocks() {
        return this;
      }
      setSender() {
        return this;
      }
      setRoom() {
        return this;
      }
      setThreadId() {
        return this;
      }
    },
  },
  IRead: {
    getRoomReader() {
      return {
        getDirectByUsernames: jest.fn(() => {}),
        getById: jest.fn(() => {}),
      };
    },
    getUserReader: () => ({
      getAppUser: jest.fn(() => ({ username: "mockedAppUser" })),
    }),
  },
  ILogger: {},
}));

jest.mock("@rocket.chat/apps-engine/definition/rooms", () => ({
  RoomType: {
    DIRECT_MESSAGE: "direct",
    CHANNEL: "channel",
  },
}));

jest.mock("@rocket.chat/ui-kit", () => ({
  PlainText: class PlainText {},
  ButtonElement: class ButtonElement {},
  Block: class Block {},
}));

jest.mock("../../ui_elements/Block.ts", () => ({
  getActionBlock: jest.fn(() => {}),
  getButtonBlock: jest.fn(() => {}),
  getTextObject: jest.fn(() => {}),
}));

describe("Utility Functions", () => {
  // Test createDirectRoom function
  it("creates a direct room", async () => {
    const read = {
      getRoomReader: jest.fn(() => ({
        getDirectByUsernames: jest.fn(() => {}),
        getById: jest.fn(() => {}),
      })),
      getUserReader: jest.fn(() => ({
        getAppUser: jest.fn(() => ({ username: "mockedAppUser" })),
      })),
      // Only include the required methods and properties
    };

    const modify = {
      getCreator: () => ({
        startRoom: () => ({
          setType: jest.fn().mockReturnThis(),
          setCreator: jest.fn().mockReturnThis(),
          setMembersToBeAddedByUsernames: jest.fn().mockReturnThis(),
          finish: jest.fn().mockReturnValue("mockedRoomId"),
        }),
      }),
    };

    const sender = { username: "sender" };
    const receiver = { username: "receiver" };

    const room = await createDirectRoom(read, modify, sender, receiver);

    expect(room).toEqual("mockedRoomId");
  });

  // // Test sendMessage function
  // it("sends a message", async () => {
  //   const modify = {
  //     getCreator: () => ({
  //       startMessage: () => ({
  //         setText: jest.fn().mockReturnThis(),
  //         setBlocks: jest.fn().mockReturnThis(),
  //         setSender: jest.fn().mockReturnThis(),
  //         setRoom: jest.fn().mockReturnThis(),
  //         setThreadId: jest.fn().mockReturnThis(),
  //       }),
  //       finish: () => jest.fn(),
  //     }),
  //   };
  //   const room = {};
  //   const sender = {};
  //   const text = "Hello, world!";
  //   const messageBlocks = [{}];
  //   const threadId = "thread123";

  //   await sendMessage(modify, room, sender, text, messageBlocks, threadId);

  //   expect(modify.getCreator()).toHaveBeenCalled();
  // });

  // it("sends a conversational message", async () => {
  //   const modify = {
  //     getCreator: () => ({
  //       startMessage: () => ({
  //         setBlocks: jest.fn().mockReturnThis(),
  //         setSender: jest.fn().mockReturnThis(),
  //         setRoom: jest.fn().mockReturnThis(),
  //         finish: jest.fn(),
  //       }),

  //     }),
  //   };
  //   const responseData = {
  //     type: "SINGLE_CHOICE",
  //     choices: [
  //       { title: "Option 1", value: "opt1" },
  //       { title: "Option 2", value: "opt2" },
  //     ],
  //     text: "Please select an option:",
  //   };
  //   const botUserCoreDB = {};
  //   const botUserPersistence = { username: "botUser" };
  //   const room = {};
  //   const appId = "yourAppId";
  //   const logger = {};
  //   const threadId = "thread123";

  //   await conversate(
  //     modify,
  //     responseData,
  //     botUserCoreDB,
  //     botUserPersistence,
  //     room,
  //     appId,
  //     logger,
  //     threadId
  //   );

  //   expect(modify.getCreator().).toHaveBeenCalled();
  // });

  // // Test getChatSession function
  // it("returns correct chat session based on room type", () => {
  //   const channelRoom = { type: "channel", id: "channel123" };
  //   const directRoom = { type: "direct", id: "direct123" };

  //   const channelSession = getChatSession(channelRoom, "thread123");
  //   const directSession = getChatSession(directRoom, "thread456");

  //   expect(channelSession).toEqual("thread123");
  //   expect(directSession).toEqual("direct123");
  // });

  // // Test getChatThreadId function
  // it("returns correct thread ID based on room type", () => {
  //   const channelMessage = {
  //     room: { type: "channel" },
  //     id: "msg123",
  //     threadId: "thread123",
  //   };
  //   const directMessage = { room: { type: "direct" }, id: "msg456" };

  //   const channelThreadId = getChatThreadId(channelMessage);
  //   const directThreadId = getChatThreadId(directMessage);

  //   expect(channelThreadId).toEqual("thread123");
  //   expect(directThreadId).toEqual("msg456");
  // });

  // // Test reverseRoomTypeMapper function
  // it("maps room types correctly", () => {
  //   const channelType = reverseRoomTypeMapper("channel");
  //   const directMessageType = reverseRoomTypeMapper("direct");
  //   const liveChatType = reverseRoomTypeMapper("live_chat");

  //   expect(channelType).toEqual("CHANNEL");
  //   expect(directMessageType).toEqual("DIRECT_CHAT");
  //   expect(liveChatType).toEqual("DIRECT_CHAT");
  // });
});
