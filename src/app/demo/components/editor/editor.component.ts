import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LayoutService} from "../../../layout/service/app.layout.service";
import {ContextMenu} from "primeng/contextmenu";
import {MenuItem} from "primeng/api";
import {EventMountArg} from "@fullcalendar/core";
import {TimeTableDTO} from "../../../../assets/models/dto/time-table-dto";
import {CourseSession} from "../../../../assets/models/dto/course-session-dto";

@Component({
  templateUrl: './editor.component.html',
})
export class EditorComponent  implements OnInit, OnDestroy{
    @ViewChild('cm') contextMenu!: ContextMenu;
    timeTable!: TimeTableDTO;

    rightClickEvent: EventMountArg | null = null;
    items: MenuItem[] = [];


    constructor(
        private layoutService: LayoutService
    ) {}

    getItemMenuOptions() : void {
        this.items = [{label: 'add new Course', icon: 'pi pi-book', command: () => {} /* this.addNewCourse()*/ }];
        if(!this.rightClickEvent?.event.id){
            return;
        }

        const session = this.findSession()
        this.items.push(
            { label: session!.fixed ? 'free Course' : 'fix Course', icon: session!.fixed ? 'pi pi-unlock':'pi pi-lock', command: () => { /*this.changeSessionBlockState()*/ }},
            { label: 'unassign Course', icon: 'pi pi-reply', command: () => { /*this.unassignCourse()*/ } },
            { label: 'remove Group', icon: 'pi pi-delete-left', command: ()=> { /*this.deleteCourse()*/ } }
        )

        const tmp = session!.name.slice(0, 2);
        this.items.push((tmp == 'PS' || tmp == 'SL') ?
            { label: 'add Group', icon: 'pi pi-plus-circle', command: ()=> { /*this.addCourseWithPsCharacter()*/ } }
            : { label: 'split Course', icon: 'pi pi-arrow-up-right-and-arrow-down-left-from-center', disabled: true }
        )
    }

    private findSession():CourseSession  | undefined{
        return this.timeTable.courseSessions.find(s => s.id.toString() === this.rightClickEvent!.event.id.toString());
    }

    ngOnInit(): void {
        this.layoutService.handleMenuBar(false);
    }

    ngOnDestroy(): void {
        this.layoutService.handleMenuBar(false);
    }
}