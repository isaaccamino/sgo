import { DeleteModalComponent } from './shared/components/delete-modal/delete-modal.component';
import { SharedModule } from './shared/shared.module';
import {CalendarComponent} from 'ap-angular2-fullcalendar/src/calendar/calendar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import { FirebaseConfig } from './../environments/firebase.config';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxMaskModule} from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderModule } from 'ngx-order-pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SearchComponent } from './layout/header/search/search.component';
import { NavigationTriggerComponent } from './layout/header/navigation-trigger/navigation-trigger.component';
import { LoginComponent } from './pages/login/login.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { CriarEventoComponent } from './pages/agendamento/criar-evento/criar-evento.component';
import { ToastrModule } from 'ngx-toastr';
import { IgrejasComponent } from './pages/igrejas/igrejas.component';
import { IgrejaModalComponent } from './pages/igrejas/igreja-modal/igreja-modal.component';
import { ModalEncarregadoComponent } from './pages/encarregado-manutencao/modal-encarregado/modal-encarregado.component';
import { TecnicoComponent } from './pages/tecnico/tecnico.component';
import { ModalTecnicoComponent } from './pages/tecnico/modal-tecnico/modal-tecnico.component';
import { OrgaoComponent } from './pages/orgao/orgao.component';
import { ModalOrgaoComponent } from './pages/orgao/modal-orgao/modal-orgao.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ModalUsuariosComponent } from './pages/usuarios/modal-usuarios/modal-usuarios.component';
import { StatusComponent } from './pages/status/status.component';
import { ModalStatusComponent } from './pages/status/modal-status/modal-status.component';
import { EncarregadoManutencaoComponent } from './pages/encarregado-manutencao/encarregado-manutencao.component';
import { UpdatePasswordComponent } from './pages/profile/update-password/update-password.component';
import { OrdemServicoComponent } from './pages/ordem-servico/ordem-servico.component';
import { OrdemServicoModalComponent } from './pages/ordem-servico/ordem-servico-modal/ordem-servico-modal.component';
import { OrdemServicoModalViewComponent } from './pages/ordem-servico/ordem-servico-modal-view/ordem-servico-modal-view.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { MapaComponent } from './pages/mapa/mapa.component';
import { EmailComponent } from './pages/email/email.component';
import { NewsModalComponent } from './shared/components/news-modal/news-modal.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PieChartComponent } from './pages/dashboard/pie-chart/pie-chart.component';
import { RegiaoComponent } from './pages/regiao/regiao.component';
import { RegiaoModalComponent } from './pages/regiao/regiao-modal/regiao-modal.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SearchComponent,
    NavigationTriggerComponent,
    LoginComponent,
    AgendamentoComponent,
    CalendarComponent,
    CriarEventoComponent,
    IgrejasComponent,
    IgrejaModalComponent,
    EncarregadoManutencaoComponent,
    ModalEncarregadoComponent,
    TecnicoComponent,
    ModalTecnicoComponent,
    OrgaoComponent,
    ModalOrgaoComponent,
    UsuariosComponent,
    ModalUsuariosComponent,
    StatusComponent,
    ModalStatusComponent,
    DeleteModalComponent,
    UpdatePasswordComponent,
    OrdemServicoComponent,
    OrdemServicoModalComponent,
    OrdemServicoModalViewComponent,
    LoaderComponent,
    MapaComponent,
    EmailComponent,
    NewsModalComponent,
    DashboardComponent,
    PieChartComponent,
    RegiaoComponent,
    RegiaoModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    PerfectScrollbarModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      progressBar: true,
      tapToDismiss: true,
      closeButton: true
    }),
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
    OrderModule,
    NgxChartsModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
