import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit, OnDestroy {
  addMovieForm: FormGroup;
  link;
  eventFile: File;
  downloadURL: Observable<string>;
  message: string;
  imagePath;
  imgURL;
  isSubmitted = false;
  @Output() addMovieFormOut = new EventEmitter<FormGroup>();
  @Output() close = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.addMovieForm = this.fb.group({
      title: [null, [Validators.required]],
      year: [null, [Validators.required]],
      rated: [null, [Validators.required]],
      released: [null, [Validators.required]],
      runtime: [null, [Validators.required]],
      genre: [null, [Validators.required]],
      director: [null, [Validators.required]],
      writer: [null, [Validators.required]],
      actors: [null, [Validators.required]],
      plot: [null, [Validators.required]],
      language: [null, [Validators.required]],
      country: [null, [Validators.required]],
      awards: [null, [Validators.required]],
      poster: [null, [Validators.required]],
      metascore: [null, [Validators.required]],
      imdbRating: [null, [Validators.required]],
      imdbVotes: [null, [Validators.required]],
      imdbID: [null, [Validators.required]],
      type: [null, [Validators.required]],
      response: [null, [Validators.required]],
      images: [[], [Validators.required]],
    });
  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    let link = new Array();
    this.isSubmitted = true;
    const randomId = Math.random().toString(36).substring(2);
    const newImageRef = this.afStorage.ref(randomId);
    const task = newImageRef.put(this.eventFile);
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = newImageRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          link.push(url);
          this.addMovieForm.value.images = link;
          this.addMovieFormOut.emit(this.addMovieForm);
          // console.log(this.addMovieForm.value);
          // console.log(this.addMovieForm.value.images);
        });
      })
    )
    .subscribe();
    this.close.emit(null);
  }
  resetForm(){
    this.addMovieForm.reset();
    this.imgURL = null;
    this.message = null;
    this.isSubmitted = false;
  }
  onCancel(){
    this.close.emit(null);
    this.isSubmitted = false;
  }
  getEventFile(event) {
    const file = event.target.files;
    this.eventFile = event.target.files[0];
    if (file.length === 0)
    return;

  var mimeType = file[0].type;
  if (mimeType.match(/image\/*/) == null) {
    this.message = "Only images are supported.";
    return;
  }

  var reader = new FileReader();
  this.imagePath = file;
  reader.readAsDataURL(file[0]);
  reader.onload = (_event) => {
    this.imgURL = reader.result;
  }
  }
}
