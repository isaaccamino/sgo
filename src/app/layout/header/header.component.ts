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
        { link: 'agenda', icon: 'zmdi-calendar-note', label: 'Agenda', role: ['ADMINGERAL', 'ADMIN', 'USER'] },
        { link: 'cidade', icon: 'zmdi-pin', label: 'Cidade', role: ['ADMINGERAL'] },
        { link: 'igreja', icon: 'zmdi-balance', label: 'Igreja', role: ['ADMINGERAL', 'ADMIN'] },
        { link: 'tecnico', icon: 'zmdi-face', label: 'Técnico', role: ['ADMINGERAL', 'ADMIN'] },
        { link: 'usuarios', icon: 'zmdi-accounts-alt', label: 'Usuários', role: ['ADMINGERAL', 'ADMIN'] },
        { link: 'status', icon: 'zmdi-alert-circle-o', label: 'Status', role: ['ADMINGERAL', 'ADMIN'] },
        { link: 'ordem-servico', icon: 'zmdi-file-text', label: 'Ordem de Serviço', role: ['ADMINGERAL', 'ADMIN', 'USER'] },
        { link: 'mapa', icon: 'zmdi-map', label: 'Mapa com as Igrejas', role: ['ADMINGERAL', 'ADMIN', 'USER', 'MINISTERIO'] },
        { link: 'enviar-mensagem', icon: 'zmdi-email', label: 'Enviar E-mail', role: ['ADMINGERAL', 'ADMIN'] },
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
    }

    ngOnInit() {
        const user = atob(localStorage.getItem('usuario')).split(',');
        this.userName = user[2];
        this.userEmail = user[0];
    }

    closeMenu = () => document.getElementById('js-menu').click();

    logout() {
        this.router.navigate(['']);
        this.afAuth.auth.signOut();
        console.clear();
        localStorage.removeItem('usuario');
        localStorage.removeItem('userCity');
        localStorage.removeItem('readNews');
    }
}
