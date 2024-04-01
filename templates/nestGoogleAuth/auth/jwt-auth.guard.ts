// auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        if (context.getType() === 'ws') {

            const ws = context.switchToWs().getClient(); // possibly `getData()` instead.
      
            return {
              ...ws,
              headers: {
                authorization: `Bearer ${ws.handshake.auth.token}`,
              },
              user: {}
            }
        }

        return context.switchToHttp().getRequest()
    }
}