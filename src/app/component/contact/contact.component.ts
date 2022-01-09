import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  errorMessage = "なんらかの原因でメッセージの送信に失敗しました。";

  contactForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    affiliation: new FormControl(''),
    message: new FormControl(''),
  });

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const body = new HttpParams()
    .set('form-name', 'contact')
    .append('name', this.contactForm.value.name)
    .append('affiliation', this.contactForm.value.affiliation)
    .append('email', this.contactForm.value.email)
    .append('message', this.contactForm.value.message)
    this.http.post('/', body.toString(), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).subscribe(
      () => {
        this.router.navigate(['/thanks']);
      },
      err => {
        if (err instanceof ErrorEvent) {
          //client side error
          alert(this.errorMessage);
          console.log(err.error.message);
        } else {
          //backend error. If status is 200, then the message successfully sent
          if (err.status === 200) {
            this.router.navigate(['/thanks'])
          } else {
            alert(this.errorMessage);
          };
        };
      }
    );
  };

}
