import React, { useEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';

// Type Definitions
interface PathNames {
  [key: string]: string;
}

interface BreadcrumbsRef {
  current: HTMLElement | null;
}

interface ItemsRef {
  current: (HTMLElement | null)[];
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbsRef: BreadcrumbsRef = useRef<HTMLElement>(null);
  const itemsRef: ItemsRef = useRef<(HTMLElement | null)[]>([]);

  const pathSegments: string[] = location.pathname
    .split('/')
    .filter((segment: string) => segment);

  const pathNames: PathNames = {
    viewWorkspace: 'Workspaces',
    workspaceCreate: 'Create Workspace',
    ModifyWorkspace: 'Edit Workspace',
    profile: 'Profile',
  };

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    try {
      ctx = gsap.context(() => {
        if (breadcrumbsRef.current) {
          gsap.fromTo(
            breadcrumbsRef.current,
            { opacity: 0, y: -10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              delay: 0.2,
            }
          );
        }

        const validItems: (HTMLElement | null)[] = itemsRef.current.filter(
          (item: HTMLElement | null) => item !== null
        );

        if (validItems.length > 0) {
          gsap.fromTo(
            validItems,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.1,
              duration: 0.4,
              ease: 'power2.out',
              delay: 0.3,
            }
          );
        }
      });
    } catch (error) {
      console.error('Error in Breadcrumbs GSAP animation:', error);
    }

    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, [pathSegments]);

  const renderBreadcrumbItem = (
    segment: string,
    index: number
  ): ReactNode => {
    const isLast: boolean = index === pathSegments.length - 1;
    const path: string = `/${pathSegments.slice(0, index + 1).join('/')}`;

    // Check if segment is a number and previous segment is ModifyWorkspace
    const isPreviousModifyWorkspace: boolean =
      index > 0 && pathSegments[index - 1] === 'ModifyWorkspace';
    const isNumericSegment: boolean = /^\d+$/.test(segment);

    if (isNumericSegment && isPreviousModifyWorkspace) {
      return (
        <li
          key={`${index}-${segment}`}
          ref={(el: HTMLElement | null) => {
            itemsRef.current[index + 1] = el;
          }}
          className="flex items-center"
        >
          <ChevronRight className="w-3 h-3 text-gray md:w-[14px] md:h-[14px] lg:w-4 lg:h-4" />
          <span className="ml-[6px] text-[10.5px] font-medium text-dark-gray md:ml-[7px] md:text-xs lg:ml-2 lg:text-sm">
            {`Workspace ${segment}`}
          </span>
        </li>
      );
    }

    return (
      <li
        key={`${index}-${segment}`}
        ref={(el: HTMLElement | null) => {
          itemsRef.current[index + 1] = el;
        }}
        className="flex items-center"
      >
        <ChevronRight className="w-3 h-3 text-gray md:w-[14px] md:h-[14px] lg:w-4 lg:h-4" />
        {isLast ? (
          <span className="ml-[6px] text-[10px] font-medium text-dark-gray md:ml-[7px] md:text-xs lg:ml-2 lg:text-xsm">
            {pathNames[segment] || segment}
          </span>
        ) : (
          <Link
            to={path}
            className="ml-[6px] text-[10px] font-medium text-primary-orange hover:text-accent-magenta transition-colors duration-200 md:ml-[7px] md:text-xs lg:ml-2 lg:text-xsm"
          >
            {pathNames[segment] || segment}
          </Link>
        )}
      </li>
    );
  };

  return (
    <nav
      ref={breadcrumbsRef}
      className="inline-flex px-[15px] py-[9px] bg-peach md:px-[18px] md:py-[10px] lg:px-2 lg:py-1"
    >
      <ol className="flex items-center space-x-[6px] md:space-x-[7px] lg:space-x-2">
        {pathSegments.map((segment: string, index: number) =>
          renderBreadcrumbItem(segment, index)
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
