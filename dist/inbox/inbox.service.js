"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
const notification_dto_1 = require("../notification/dto/notification.dto");
let InboxService = class InboxService {
    constructor(prisma, notification) {
        this.prisma = prisma;
        this.notification = notification;
    }
    async sendToAll(createInboxDto) {
        let payload = new notification_dto_1.NotificationDto();
        payload.url = createInboxDto.url;
        payload.body_tm = createInboxDto.messageTm;
        payload.body_ru = createInboxDto.messageRu;
        payload.title_ru = createInboxDto.titleRu;
        payload.title_tm = createInboxDto.titleTm;
        await this.prisma.fCMToken.findMany({
            where: {
                NOT: [
                    { token: undefined }
                ]
            }
        }).then(async (result) => {
            await this.notification.sendToAll(payload, result.map(item => item.token));
        });
        return this.prisma.inbox.create({
            data: createInboxDto
        });
    }
    async sendToUser(createInboxDto) {
        let payload = new notification_dto_1.NotificationDto();
        payload.url = createInboxDto.url;
        payload.body_tm = createInboxDto.messageTm;
        payload.body_ru = createInboxDto.messageRu;
        payload.title_ru = createInboxDto.titleRu;
        payload.title_tm = createInboxDto.titleTm;
        console.log(payload);
        await this.prisma.fCMToken.findMany({
            where: {
                NOT: [
                    { token: undefined }
                ],
                AND: [
                    {
                        userId: createInboxDto.userId
                    }
                ]
            }
        }).then(async (result) => {
            await this.notification.sendToAll(payload, result.map(item => item.token));
        });
        return this.prisma.inbox.create({
            data: createInboxDto
        });
    }
    findAll() {
        return this.prisma.inbox.findMany({
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ]
        });
    }
    remove(id) {
        return this.prisma.inbox.delete({
            where: { id: id }
        });
    }
    async getUserInbox(id) {
        let res;
        await this.prisma.inbox.findMany({
            where: {
                OR: [
                    {
                        userId: id
                    },
                    {
                        userId: null
                    }
                ]
            },
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ]
        }).then(result => {
            res = result;
        });
        await this.prisma.inbox.updateMany({
            where: {
                userId: id
            },
            data: {
                isRead: true
            }
        });
        return res;
    }
};
InboxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notification_service_1.NotificationsService])
], InboxService);
exports.InboxService = InboxService;
//# sourceMappingURL=inbox.service.js.map