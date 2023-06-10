// import {
//     ILogger,
//     IModify,
//     IPersistence,
//     IRead,
//   } from "@rocket.chat/apps-engine/definition/accessors";
  
//   import {
//     IUIKitResponse,
//     UIKitBlockInteractionContext,
//     UIKitViewSubmitInteractionContext,
//   } from "@rocket.chat/apps-engine/definition/uikit";
//   import { updateUpdateBotModal } from "../ui_elements/modals/";
  
//   const updateBotUIFlow = async (
//     context: UIKitBlockInteractionContext,
//     read: IRead,
//     persistence: IPersistence,
//     modify: IModify,
//     appId: string,
//     logger: ILogger
//   ): Promise<void> => {
//     const triggerId = context.getInteractionData().triggerId;
//     const updateBotModal = updateUpdateBotModal(
//       context,
//       read,
//       persistence,
//       modify,
//       appId
//     );
//     logger.warn(updateBotModal);
  
//     await modify
//       .getUiController()
//       .openSurfaceView(
//         updateBotModal,
//         { triggerId },
//         context.getInteractionData().user
//       );
//   };
  
//   const updateBotDBFlow = async (
//     context: UIKitViewSubmitInteractionContext,
//     read: IRead,
//     persistence: IPersistence,
//     modify: IModify,
//     logger: ILogger
//   ) => {
//     const { view } = context.getInteractionData();
  
//     logger.log(view.state);
//   };
  
//   export { updateBotUIFlow, updateBotDBFlow };
  