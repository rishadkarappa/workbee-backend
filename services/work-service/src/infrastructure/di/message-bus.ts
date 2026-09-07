import { container } from "tsyringe";

import { WorkerEventPublisher } from "../message-bus/WorkerEventPublisher"
import { WorkerChangePasswordConsumer } from "../message-bus/WorkerChangePasswordConsumer";
import { WorkProgressEventPublisher } from "../message-bus/WorkProgressEventPublisher";
import { IWorkProgressEventPublisher } from "../../domain/message-bus/IWorkProgressEventPublisher";
import { IWorkerEventPublisher } from "../../domain/message-bus/IWorkerEventPublisher";
import { IWorkerChangePasswordConsumer } from "../../domain/message-bus/IIWorkerChangePasswordConsumer";
import { GetUserProfileRpcClient } from "../message-bus/GetUserProfileRpcClient";
import { IGetUserProfileRpcClient } from "../../domain/message-bus/IGetUserProfileRpcClient";

/** publishers */
container.registerSingleton<IWorkerEventPublisher>("WorkerEventPublisher", WorkerEventPublisher)
container.registerSingleton<IWorkProgressEventPublisher>("WorkProgressEventPublisher", WorkProgressEventPublisher)

/** consumers */
container.registerSingleton<IWorkerChangePasswordConsumer>("WorkerChangePasswordConsumer", WorkerChangePasswordConsumer)

/** clients */
container.registerSingleton<IGetUserProfileRpcClient>("GetUserProfileRpcClient", GetUserProfileRpcClient);