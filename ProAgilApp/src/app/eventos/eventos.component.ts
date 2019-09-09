import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

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
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  titulo = 'Eventos';
  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  constructor(private eventoService: EventoService
            , private modalServise: BsModalService
            , private fb: FormBuilder
            , private localeService: BsLocaleService
            , private toastrService: ToastrService) {
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

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.evento.imagemUrl = '';
    this.evento.lotes = [];
    this.evento.palestrante = [];
    this.evento.redesSociais = [];
    this.registerForm.patchValue(this.evento);
    this.fileNameToUpdate = this.evento.imagemUrl.toString();
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

  uploadImagem() {

    if (this.modoSalvar === 'post'){
    const nomeArquivo = this.evento.imagemUrl.split('\\', 3);
    this.evento.imagemUrl = nomeArquivo[2];

    this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(
      () => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      }
    );
    } else {
      this.evento.imagemUrl = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
  }

  salvarAlteracao(template: any) {
      if (this.registerForm.valid) {
        if (this.modoSalvar === 'post') {
          this.evento = Object.assign({}, this.registerForm.value);

          this.uploadImagem();
          this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento: Evento) => {
              this.toastrService.success('Evento editado com sucesso!');
              template.hide();
              this.getEventos();
            }, error => {
              this.toastrService.success(`Erro ao salvar evento: ${error}`);
            }
          );
        } else {
          this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

          this.uploadImagem();
          this.eventoService.putEvento(this.evento).subscribe(
            (novoEvento: Evento) => {
              this.toastrService.success('Evento editado com sucesso!');
              template.hide();
              this.getEventos();
            }, error => {
              this.toastrService.error(`Erro ao editar evento: ${error}`);
            }
          );
        }
      }
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o evento: ${evento.tema}, Código: ${evento.id}?`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastrService.success('Evento excluído com sucesso!', 'Exclusão');
      }, error => {
        this.toastrService.error(`Erro ao excluir evento: ${error}`);
      }
    );
  }

  onFileChange(event) {

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }

    console.log(event);
  }


}
