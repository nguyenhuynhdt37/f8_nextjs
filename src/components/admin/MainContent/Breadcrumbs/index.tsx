import Link from "next/link";
import { Fragment } from "react";

type BreadcrumbItemProps = {
  title: string;
  link: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItemProps[] }) {
  return (
    <div className="text-[1.3rem] ">
      <div className="flex text-[#2b2522]">
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <div>
                <Link href={item.link}>{item.title}</Link>
              </div>
            )}
            {index < items.length - 1 && <div className="px-2">/</div>}
            {index === items.length - 1 && <div>{item.title}</div>}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
