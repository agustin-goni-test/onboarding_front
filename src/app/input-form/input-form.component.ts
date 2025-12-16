import { Component } from '@angular/core';
import { InferenceService } from '../inference.service';
import { InferenceResultModel } from '../models/inference-result.model';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { JsonPipe, CommonModule } from '@angular/common';
import { finalize, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    CommonModule
  ],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.css'
})

export class InputFormComponent {
  
  // Maintain variables for the call
  selectedFiles: File[] = [];
  userId: string = '';
  inferenceType: string = 'account'; // Default value

  // Variables for controlling the call
  result: any = null;
  loading = false;
  errorMessage: string | null = null;

  // Persistent results used as the final "outcome" of the inference
  captured: InferenceResultModel = new InferenceResultModel();

  constructor(private inferenceService: InferenceService) { }

  // Map that holds "friendly names" of fields
  fieldLabels: Record<string, string> = {
    nombre_banco: "Nombre del banco",
    tipo_cuenta: "Tipo de cuenta",
    num_cuenta: "Número de cuenta",
    nombre_contacto: "Nombre del contacto",
    rut_contacto: "RUT del contacto",
    num_serie: "Número de serie de documento",
    razon_social: "Razón social",
    nombre_fantasia: "Nombre de fantasía",
    actividad_economica: "Actividad económica",
    composition: "Composición de la sociedad"
  }

  // Method that translates the names from source to friendly
  getLabel(field: string): string {
    return this.fieldLabels[field] ?? field;
  }

  // To run when selecting a file
  onFilesSelected(event: any) {
    //const files: FileList = event.target.files
    //this.selectedFiles = Array.from(files);
    const newFiles = Array.from(event.target.files) as File[];
    
    for (const file of newFiles) {
      // Avoid duplicates
      if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) {
        this.selectedFiles.push(file);
      }
    }
  }

  // Send the call through a multi part POST operation
  send() {
    if (!this.selectedFiles.length) return;

    // Control variables
    this.loading = true;
    this.result = null;
    this.errorMessage = null;

    const fileToSend = this.selectedFiles[0]; // For now, send only the first file

    // Call the service
    // Use success and error branches (Observable)
    // Use pipe for finalization and controlling the end state, success or not
    this.inferenceService
      .inferDocument(this.userId, this.inferenceType, fileToSend)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (result) => {
          this.result = result;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.errorMessage = `Error: ${err.statusText} (Status: ${err.status}). Please check the console for more details.`;
        }
      }
      )

    }

    // Method uses to capture results from the inference
    captureResults() {
      if (!this.result?.data) return;

      for (const item of this.result.data) {
        const field = item.field;
        const value = item.probable_value;

        // Display the captured values in the model
        switch (field) {
          case "nombre_contacto":
            this.captured.contactName = value;
            break;

          case "rut_contacto":
            this.captured.contactRut = value;
            break;

          case "num_serie":
            this.captured.serialNumber = value;
            break;

          case "nombre_banco":
            this.captured.bankName = value;
            break;

          case "tipo_cuenta":
            this.captured.accountType = value;
            break;

          case "num_cuenta":
            this.captured.accountNumber = value;
            break;

          case "razon_social":
            this.captured.socialReason = value;
            break;

          case "nombre_fantasia":
            this.captured.fantasyName = value;
            break;

          case "actividad_economica":
            this.captured.economicActivity = value;
            break;
            
          case "composicion":
            this.captured.composition = value;
            break;

          default:
            console.warn("Campo desconocido:", field);

        }
      }

      console.log("Captura de campos estructurados:", this.captured)
    }

    getCandidates(item: any): string[] {
      const arr =
        item.values ??
        item.candidates ??
        item.alternatives ??
        item.variants ??
        item.multiple_values ??
        [];
      
      // Ensure it always returns an array of strings
      if (!Array.isArray(arr)) return [];
      return arr.map(v => (v == null ? '' : String(v)));
    } 

    editItem(item: any) {
      item._editing = true;
      item._useOther = false

      const candidates = this.getCandidates(item);
      // Default edit value is current probable value
      item._editValue = item.probable_value;

      // If there are candidatos, select the matching one, else Other
      if (candidates.length > 0) {
        const match = candidates.find((c: any) => c === item.probable_value);
        if (match !== undefined) {
          item._selectedCandidate = match;
          item._useOther = false;
        }
        else {
          item._selectedCandidate = '__other__';
          item._useOther = true;
        }
      }
      else {
        item._selectedCandidate = undefined;
      }

    }

    onCandidateChange(item: any) {
      if (item._selectedCandidate === '__other__') {
        item._useOther = true;
        item._editValue = '';
      }
      else {
        item._useOther = false;
        item._editValue = item._selectedCandidate;
      }
    } 

    saveItem(item: any) {
      item.probable_value = item._editValue;
      item._editing = false;
      delete item._editValue;
      delete item._selectedCandidate;
      delete item._useOther;
      // Re-run capture results?
    }

    cancelEdit(item: any) {
      item._editing = false;
      delete item._editValue;
      delete item._selectedCandidate;
      delete item._useOther;
    }

}
