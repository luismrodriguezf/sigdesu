import {Component, Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-modal-content',
  templateUrl: './popup-modal-content.component.html',
  styleUrls: ['./popup-modal-content.component.css']
})
export class PopupModalContentComponent{
	
	@Input() datos;

	constructor(public activeModal: NgbActiveModal){}

}