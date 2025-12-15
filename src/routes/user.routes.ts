import { Router } from 'express';

export class UserRoutes {
  readonly router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {

  }
}

const userRoutesInstance = new UserRoutes();
export default userRoutesInstance.router;

