import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  _filtroLista: string;
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  larguraImagem = 50;
  margemImagem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef;
  registerForm: FormGroup;

  constructor(private eventoService: EventoService
            , private modalServise: BsModalService
            , private fb: FormBuilder
            , private localeService: BsLocaleService) {
                this.localeService.use('pt-br');
             }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this._filtroLista) : this.eventos;
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  openModalCarregado(template: any, evento: Evento) {
      this.registerForm.get('tema').setValue(evento.tema);
      this.registerForm.get('local').setValue(evento.local);
      this.registerForm.get('dataEvento').setValue(evento.dataEvento);
      this.registerForm.get('qtdPessoas').setValue(evento.qtdPessoas);
      this.registerForm.get('telefone').setValue(evento.telefone);
      this.registerForm.get('imagemUrl').setValue(evento.imagemUrl);
      this.registerForm.get('email').setValue(evento.email);

      template.show();
  }

  ngOnInit() {
    this.getEventos();
    this.validation();
  }

  getEventos() {
      this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line: variable-name
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
      }, error => {
        console.log(error);
      }
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      imagemUrl: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  salvarAlteracao(template: any) {
      if (this.registerForm.valid) {
          this.evento = Object.assign({}, this.registerForm.value);
          this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento: Evento) => {
              console.log(novoEvento);
              template.hide();
              this.getEventos();
            }, error => {
              console.log(error);
            }
          );
      }
  }

}
