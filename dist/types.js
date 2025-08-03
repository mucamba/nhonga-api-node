"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NhongaError = void 0;
class NhongaError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'NhongaError';
    }
}
exports.NhongaError = NhongaError;
//# sourceMappingURL=types.js.map