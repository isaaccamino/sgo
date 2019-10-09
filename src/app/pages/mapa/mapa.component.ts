import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Icon, icon, Marker, marker } from 'leaflet';
import { Igreja } from '../igrejas/igreja';
import { NewsModalComponent } from 'src/app/shared/components/news-modal/news-modal.component';
declare let L;

@Component({
    selector: 'app-mapa',
    templateUrl: './mapa.component.html',
    styleUrls: ['./mapa.component.scss'],
    providers: [AngularFireDatabase, AngularFireAuth],
})
export class MapaComponent implements OnInit {
    @ViewChild(NewsModalComponent) newsModal: NewsModalComponent;

    public layerGroup: any;
    public igrejas: [Igreja];
    public isLoaded = true;
    public map: any;
    private defaultIcon: Icon = icon({
        iconUrl: './../../../assets/leaflet/images/marker-icon.png',
        shadowUrl: './../../../assets/leaflet/images/marker-shadow.png'
    });
    private redIcon: Icon = icon({
        iconUrl: './../../../assets/leaflet/images/marker-icon-red.png',
        shadowUrl: './../../../assets/leaflet/images/marker-shadow.png'
    });
    private greenIcon: Icon = icon({
        iconUrl: './../../../assets/leaflet/images/marker-icon-green.png',
        shadowUrl: './../../../assets/leaflet/images/marker-shadow.png'
    });
    private greyIcon: Icon = icon({
        iconUrl: './../../../assets/leaflet/images/marker-icon-grey.png',
        shadowUrl: './../../../assets/leaflet/images/marker-shadow.png'
    });
    private orangeIcon: Icon = icon({
        iconUrl: './../../../assets/leaflet/images/marker-icon-orange.png',
        shadowUrl: './../../../assets/leaflet/images/marker-shadow.png'
    });
    private purpleIcon: Icon = icon({
        iconUrl: './../../../assets/leaflet/images/marker-icon-violet.png',
        shadowUrl: './../../../assets/leaflet/images/marker-shadow.png'
    });
    selectedChurch: string[];
    userLat: number;
    userLng: number;

    constructor(private angularFire: AngularFireDatabase) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setLocale.bind(this));
        } else {
            console.log('Geolocation not supported');
        }
    }

    setLocale(position: any): void {
        this.map.setView([position.coords.latitude, position.coords.longitude], 15);
        this.userLat = position.coords.latitude;
        this.userLng = position.coords.longitude;
    }

    ngOnInit() {
        this.getIgrejas();

        this.map = L.map('map', {
            scrollWheelZoom: false,
        }).setView([this.userLng || -23.175477, this.userLat || -45.878163], 15);


        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    ngAfterViewInit(): void {
        const readNews = localStorage.getItem('readNews');
        if (readNews === 'false') {
            this.newsModal.showModal();
        }
    }

    getIgrejas(): void {
        this.isLoaded = false;
        this.angularFire.list(`regioes/${localStorage.getItem('userCity')}/igrejas`).valueChanges().subscribe(
            (data: [Igreja]) => {
                this.igrejas = data;
                this.isLoaded = true;
                this.addPointsInMap(this.igrejas);
            }
        );
    }

    addPointsInMap(igrejas: Igreja[]) {
        this.layerGroup = L.layerGroup().addTo(this.map);
        this.map.setZoom(14);

        igrejas.forEach((igreja: Igreja) => {
            const popupContent = `
                <h5>${igreja.bairro}</h5>
                <span>Encarregado local de manutenção: ${igreja.tecnico}</span> <br>
                <span>Telefone Contato: ${igreja.numCel}</span>
                ${igreja.ordemServico && this.checkOS(igreja.ordemServico) ?
                    `<br> Status OS: <b> ${igreja.ordemServico.status}</b>
                    <br> OS aberta: <b>${igreja.ordemServico.osNumber}</b>`
                    :
                    ``
                }
                <br>
                ${this.userLat && this.userLng ?
                    `<span>
                        Distância até essa igreja, aproximadamente:
                        ${this.getDistance([igreja.lat, igreja.lng], [this.userLat, this.userLng]).toFixed(3)} quilômetros
                    </span>`
                    :
                    ''
                }
                <br>
                <a
                    href="https://maps.google.com/maps?daddr=${igreja.lat},${igreja.lng}&amp;ll="
                    target="_blank"
                    style="display: block; text-align: right"
                >
                    Abrir no GPS
                </a>
            `;

            if (igreja.ordemServico !== undefined) {
                switch (igreja.ordemServico.status) {
                    case 'Agendar':
                        Marker.prototype.options.icon = this.defaultIcon;
                        break;
                    case 'Agendado':
                        Marker.prototype.options.icon = this.greenIcon;
                        break;
                    case 'URGENTE':
                        Marker.prototype.options.icon = this.redIcon;
                        break;
                    case 'Não solucionado':
                        Marker.prototype.options.icon = this.purpleIcon;
                        break;
                    case 'Contatar TOKAI':
                        Marker.prototype.options.icon = this.orangeIcon;
                        break;
                    default:
                        Marker.prototype.options.icon = this.greyIcon;
                        break;
                }
            } else {
                Marker.prototype.options.icon = this.greyIcon;
            }

            L.marker([igreja.lat || '', igreja.lng || ''])
                .bindPopup(popupContent)
                .openPopup()
                .addTo(this.layerGroup);
        });
    }

    rad(x: number) {
        return x * Math.PI / 180;
    }

    getDistance(p1: number[], p2: number[]) {
        // Earth’s mean radius in meter
        const R = 6378137;
        const dLat = this.rad(p2[0] - p1[0]);
        const dLong = this.rad(p2[1] - p1[1]);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1[0])) * Math.cos(this.rad(p2[0])) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d / 1000; // returns the distance in km
    }



    checkOS(OS: { status: string }) {
        return OS.status.includes('URGENTE') || OS.status.includes('Agendar') || OS.status.includes('Agendado');
    }

    onChange(church: Igreja) {
        this.map.setView([church.lat, church.lng], 13);
        this.layerGroup.clearLayers();
        this.addPointsInMap([church]);
        this.map.setView([church.lat, church.lng], 16);
    }

    onClear() {
        this.addPointsInMap(this.igrejas);
    }

}
