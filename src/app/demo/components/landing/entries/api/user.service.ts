import {Injectable, Type} from '@angular/core';
import { ItemService } from 'src/assets/models/interfaces/ItemServiceInterface';
import {Userx} from "../../../../../../assets/models/userx";
import {UserDialog} from "../../../dialogs/user-dialog/user-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class UserService implements ItemService<Userx> {

    constructor() {
    }

    getItemDialog(): any {
        return UserDialog;
    }

    getTableHeader(): any[] {
        return Userx.getTableColumns();
    }

    getAllItems(): Userx[] {
        throw new Error('Method not implemented.');
    }
    createSingeItem(): Userx {
        throw new Error('Method not implemented.');
    }
    updateSingeItem(): Userx {
        throw new Error('Method not implemented.');
    }
    deleteSingleItem(): void {
        throw new Error('Method not implemented.');
    }
    deleteMultipleItem(): void {
        throw new Error('Method not implemented.');
    }
}
