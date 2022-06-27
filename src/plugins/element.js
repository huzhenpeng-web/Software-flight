import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Scrollbar,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  RadioButton,
  DatePicker,
  Carousel,
  CarouselItem,
  Autocomplete,
  Message,
  Empty,
  MessageBox,
  Tag,
  OptionGroup,
  Loading,
  Link,
  Collapse,
  CollapseItem,
  Image,
  Dialog,
  Descriptions,
  DescriptionsItem,
  Timeline,
  TimelineItem
} from 'element-ui'

const plugins = [
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Scrollbar,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  RadioButton,
  DatePicker,
  Carousel,
  CarouselItem,
  Autocomplete,
  Empty,
  Tag,
  OptionGroup,
  Loading,
  Link,
  Collapse,
  CollapseItem,
  Image,
  Dialog,
  Descriptions,
  DescriptionsItem,
  Timeline,
  TimelineItem
]

plugins.forEach(item => {
  return Vue.use(item)
})

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
