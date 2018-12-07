
import {NavbarTemplateDirective} from '../../../shared/navbar/navbar-template.directive';

type Undefinable<T> = T | undefined;

export namespace LayoutModels {
  export interface State {
    navbarTemplateStack: Array<NavbarTemplateDirective>
  }
}
