import {
    AfterViewChecked, AfterViewInit,
    Component, OnDestroy, OnInit, signal,
    ViewChild, WritableSignal,
} from '@angular/core';
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import {CalendarOptions} from "@fullcalendar/core";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {LayoutService} from "../../../layout/service/app.layout.service";
import {Subscription} from "rxjs";

class InfoBox {
    icon: string
    header: string
    value: any
    highlight: string
    fin: string
    color: string
    width: number
}

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit{
    @ViewChild("cal") calendar!: FullCalendarComponent;
    menuToggleSub!: Subscription;

    readonly calendarOptions: WritableSignal<CalendarOptions> = signal({
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
        height: "85vh",
        eventBackgroundColor: "#666666",
        eventBorderColor: "#050505",
        eventTextColor: "var(--system-color-primary-white)",
        slotMinTime: '08:00',
        slotMaxTime: '22:00',
        slotDuration: '00:15',
        slotLabelInterval: '00:30',
        dayHeaderFormat: {weekday: 'long'},
        eventOverlap: true,
        slotEventOverlap: true,
        nowIndicator: false,
        handleWindowResize: true
        //eventClick: this.showHoverDialog.bind(this),
    });

    infos!: InfoBox[];

    constructor(
        private layoutService: LayoutService,
    ) {  }



    protected updateCalendarSize(){
        this.calendar.getApi().updateSize();
    }

    ngOnInit(): void {
        //INFO: The Width of all combined boxed must sum up to 12
        this.infos = [
            {
                icon: 'pi pi-book text-green-500 text-xl',
                header: 'Courses', value : 152, color: 'bg-green-100',
                highlight : '24% ', fin: 'are assigned', width: 3
            },
            {
                icon: 'pi pi-check-circle text-orange-500 text-xl',
                header: 'Collisions', value : 5, color: 'bg-orange-100',
                highlight : '3 ', fin: 'Courses are affected', width: 3
            },
            {
                icon: 'pi pi-comments text-cyan-500 text-xl',
                header: 'Last Change', value : 'Course PS Lineare Algebra - Group 3 was moved to room 3W04', color: 'bg-cyan-100',
                highlight : 'Elias ', fin: 'made the change', width: 6
            }
        ]
    }

    ngAfterViewInit(): void {
        this.menuToggleSub = this.layoutService.updateSize$
            .asObservable().subscribe(() => {
                this.updateCalendarSize();
        });
    }

    ngOnDestroy(): void {
        if(this.menuToggleSub) this.menuToggleSub.unsubscribe();
    }
}
