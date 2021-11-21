import { Component } from '@angular/core';

@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.css']
})
export class ParticlesComponent {
  id = "tsparticles";
  particlesUrl = "/assets/particles_config.json"

  constructor() { }

}
