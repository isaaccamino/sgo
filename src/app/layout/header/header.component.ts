import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { SharedService } from './../../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [SharedService, AngularFireAuth],
    animations: [
        trigger('toggleHeight', [
            state('inactive', style({
                height: '0',
                opacity: '0'
            })),
            state('active', style({
                height: '*',
                opacity: '1'
            })),
            transition('inactive => active', animate('200ms ease-in')),
            transition('active => inactive', animate('200ms ease-out'))
        ])
    ],
})
export class HeaderComponent implements OnInit {
    messagesData: Array<any>;
    tasksData: Array<any>;
    maThemeModel: string;
    sidebarVisible = false;
    public userName: string;
    public userEmail: string;

    itemsMenu = [
        { link: 'agenda', icon: 'zmdi-calendar-note', label: 'Agenda', role: ['ADMIN', 'USER'] },
        { link: 'igreja', icon: 'zmdi-balance', label: 'Igreja', role: ['ADMIN'] },
        { link: 'tecnico', icon: 'zmdi-face', label: 'Técnico', role: ['ADMIN'] },
        { link: 'usuarios', icon: 'zmdi-accounts-alt', label: 'Usuários', role: ['ADMIN'] },
        { link: 'status', icon: 'zmdi-alert-circle-o', label: 'Status', role: ['ADMIN'] },
        { link: 'ordem-servico', icon: 'zmdi-file-text', label: 'Ordem de Serviço', role: ['ADMIN', 'USER'] },
        { link: 'mapa', icon: 'zmdi-map', label: 'Mapa com as Igrejas', role: ['ADMIN', 'USER', 'MINISTERIO'] },
        { link: 'enviar-mensagem', icon: 'zmdi-email', label: 'Enviar E-mail', role: ['ADMIN'] },
    ];

    // Sub menu visibilities
    navigationSubState: any = {
        Forms: 'inactive',
    };

    // Toggle sub menu
    toggleNavigationSub(menu, event) {
        event.preventDefault();
        this.navigationSubState[menu] = (this.navigationSubState[menu] === 'inactive' ? 'active' : 'inactive');
    }

    setTheme() {
        this.sharedService.setTheme(this.maThemeModel)
    }

    constructor(private sharedService: SharedService, private afAuth: AngularFireAuth, private router: Router) {
        sharedService.maThemeSubject.subscribe((value) => {
            this.maThemeModel = value;
        });
        this.sharedService.sidebarVisibilitySubject.subscribe((value) => {
            this.sidebarVisible = value;
        });

        this.messagesData = [
            {
                image: './assets/demo/img/profile-pics/1.jpg',
                name: 'David Belle',
                message: 'Cum sociis natoque penatibus et magnis dis parturient montes',
                date: '12:01 PM'
            },
            {
                image: './assets/demo/img/profile-pics/2.jpg',
                name: 'Jonathan Morris',
                message: 'Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel',
                date: '02:45 PM'
            },
            {
                image: './assets/demo/img/profile-pics/6.jpg',
                name: 'Fredric Mitchell Jr.',
                message: 'Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies',
                date: '08:21 PM'
            },
            {
                image: './assets/demo/img/profile-pics/4.jpg',
                name: 'Glenn Jecobs',
                message: 'Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque',
                date: '08:43 PM'
            },
            {
                image: './assets/demo/img/profile-pics/5.jpg',
                name: 'Bill Phillips',
                message: 'Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat',
                date: '11:32 PM'
            }
        ];

        this.tasksData = [
            {
                name: 'HTML5 Validation Report',
                completed: 95,
                color: ''
            }, {
                name: 'Google Chrome Extension',
                completed: '80',
                color: 'success'
            }, {
                name: 'Social Intranet Projects',
                completed: '20',
                color: 'warning'
            }, {
                name: 'Bootstrap Admin Template',
                completed: '60',
                color: 'danger'
            }, {
                name: 'Youtube Client App',
                completed: '80',
                color: 'info'
            }
        ]
    }

    ngOnInit() {
        const user = atob(localStorage.getItem('usuario')).split(',');
        this.userName = user[2];
        this.userEmail = user[0];
    }

    closeMenu() {
        document.getElementById('js-menu').click();
    }

    logout() {
        this.router.navigate(['']);
        localStorage.removeItem('usuario');
        this.afAuth.auth.signOut();
        console.clear();
    }
}
