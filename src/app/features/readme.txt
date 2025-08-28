    ├── features/                    # ogni feature = modulo con lazy loading
    │   ├── home/
    │   │   ├── home.component.ts
    │   │   ├── home.module.ts
    │   │   └── home-routing.module.ts
    │   │
    │   ├── users/
    │   │   ├── pages/               # UserList, UserDetail
    │   │   ├── services/            # UserService (scoped solo al modulo se non in Core)
    │   │   ├── users.module.ts
    │   │   └── users-routing.module.ts
    │   │
    │   ├── products/
    │   │   ├── pages/
    │   │   ├── products.module.ts
    │   │   └── products-routing.module.ts
    │   │
    │   └── admin/
    │       ├── pages/
    │       ├── admin.module.ts
    │       └── admin-routing.module.ts
    │