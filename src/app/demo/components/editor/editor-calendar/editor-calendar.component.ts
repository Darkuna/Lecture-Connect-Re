import {Component, EventEmitter, Input, Output, signal, ViewChild, WritableSignal} from '@angular/core';
import {FullCalendarComponent} from "@fullcalendar/angular";
import {CalendarOptions, EventInput} from "@fullcalendar/core";
import interactionPlugin, {DropArg} from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import {MessageService} from "primeng/api";
import {RoomTable} from "../../../../../assets/models/room-table";

@Component({
  selector: 'app-editor-calendar',
  templateUrl: './editor-calendar.component.html',
})
export class EditorCalendarComponent{
    @Input() currentEvents: EventInput[] = [];
    @Input() selectedRoom!: RoomTable;

    @Output() setDirtyBool = new EventEmitter<boolean>();
    @ViewChild("cal") calendar!: FullCalendarComponent;

    protected calendarOptions: WritableSignal<CalendarOptions> = signal({
        plugins: [
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,
        ],
        headerToolbar: {
            left: '',
            center: '',
            right: ''
        },
        initialView: 'timeGridWeek',
        weekends: false,
        editable: false,
        selectable: false,
        selectMirror: true,
        dayMaxEvents: true,
        allDaySlot: false,
        dragScroll: true,
        height: '70vh',
        eventBackgroundColor: '#666666',
        eventBorderColor: '#050505',
        eventTextColor: 'var(--sys-color-primary-white)',
        slotMinTime: '08:00:00',
        slotMaxTime: '22:00:00',
        slotDuration: '00:15:00',
        slotLabelInterval: '00:30:00',
        dayHeaderFormat: {weekday: 'long'},
        eventOverlap: true,
        slotEventOverlap: true,
        nowIndicator: false,
        drop: this.drop.bind(this),
        eventReceive: this.eventReceive.bind(this),
        eventChange: this.eventChange.bind(this),
        eventAllow: this.eventAllow.bind(this),
    });

    constructor(
        private messageService: MessageService
    ) { }

    private drop(arg: DropArg) {
        const participants = Number(arg.draggedEl.getAttribute('data-participants'));
        const needsComputers = Boolean(arg.draggedEl.getAttribute('data-hasComputers'));

        if(this.checkNrOfParticipants(participants)){
            this.messageService.add({
                severity: 'error', life: 5000,
                summary: 'ROOM CAPACITY  COLLISION',
                detail: `The selected course (${arg.draggedEl.getAttribute('data-title')}) has to many participants (${participants}) for the selected room(${this.selectedRoom?.capacity})`});
        } else if (this.checkIfComputersNeeded(needsComputers)){
            this.messageService.add({
                severity: 'error', life: 5000,
                summary: 'COMPUTER  COLLISION',
                detail: `The selected course (${arg.draggedEl.getAttribute('data-title')}) needs computers which are not supported by the current room`});
        } else {
            const draggedElement = arg.draggedEl;

            if (draggedElement && draggedElement.parentNode) {
                draggedElement.parentNode.removeChild(draggedElement);
            }
            this.setDirtyBool.emit(true);
        }
    }

    private eventReceive(args: any){
        const participants = args.event.extendedProps['nrOfParticipants'];
        const needsComputers = args.event.extendedProps['computersNecessary'];
        console.log(args)

        if(this.checkNrOfParticipants(participants) || this.checkIfComputersNeeded(needsComputers)){
            args.revert();
        } else {
            //this.rightClickEvent = args;
            //this.updateSession(args.event, true);
            this.setDirtyBool.emit(true);
        }
    }

    private checkNrOfParticipants(nrOfParticipants: number):boolean{
        const roomCapacity = this.selectedRoom.capacity;
        return (nrOfParticipants >= roomCapacity);
    }

    private checkIfComputersNeeded(needsComputers: boolean): boolean {
        console.log('needs a computer: ', needsComputers);
        const hasComputers = this.selectedRoom.computersAvailable;

        console.log('has a computer: ', hasComputers);
        console.log('allow drop: ', !(!hasComputers && needsComputers));
        return !(!hasComputers && needsComputers);

    }

    private eventChange(){
        this.setDirtyBool.emit(true);
    }

    private eventAllow(args: any): boolean {
        const startHour = args.start.getHours();
        const startMinutes = args.start.getMinutes();

        const isBefore815AM = startHour < 8 || (startHour === 8 && startMinutes < 15);
        const isAfter10PM = args.end.getHours() >= 22;

        return !isBefore815AM && !isAfter10PM;
    }
}
